# ─── OpenHuman Infrastructure ─────────────────────────────────────
# Deploys to Google Cloud Platform using Cloud Run + Firestore
# Usage: terraform init && terraform plan && terraform apply

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {
    bucket = "openhuman-terraform-state-exalted-country-487223-e3"
    prefix = "terraform/state"
  }
}

# ─── Variables ──────────────────────────────────────────────────────
variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
  default     = "openhuman.ai"
}

variable "min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 1
}

variable "max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 10
}

# ─── Provider ───────────────────────────────────────────────────────
provider "google" {
  project = var.project_id
  region  = var.region
}

# ─── Enable APIs ────────────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "compute.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# ─── Artifact Registry ─────────────────────────────────────────────
resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = "openhuman"
  format        = "DOCKER"
  depends_on    = [google_project_service.apis]
}

# ─── Firestore Database ────────────────────────────────────────────
resource "google_firestore_database" "main" {
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  depends_on  = [google_project_service.apis]
}

# Firestore Indexes
resource "google_firestore_index" "tasks_category_status" {
  database   = google_firestore_database.main.name
  collection = "tasks"
  fields {
    field_path = "category"
    order      = "ASCENDING"
  }
  fields {
    field_path = "status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "tasks_location" {
  database   = google_firestore_database.main.name
  collection = "tasks"
  fields {
    field_path = "location"
    order      = "ASCENDING"
  }
  fields {
    field_path = "status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "payAmount"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "bookings_user" {
  database   = google_firestore_database.main.name
  collection = "bookings"
  fields {
    field_path = "humanId"
    order      = "ASCENDING"
  }
  fields {
    field_path = "status"
    order      = "ASCENDING"
  }
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# ─── Secret Manager ────────────────────────────────────────────────
resource "google_secret_manager_secret" "app_secrets" {
  for_each = toset([
    "jwt-secret",
    "firebase-admin-key",
    "wechat-pay-api-key",
    "wechat-pay-mch-id",
    "alipay-app-id",
    "alipay-private-key",
    "crypto-webhook-secret",
  ])
  secret_id = "openhuman-${each.key}"
  replication {
    auto {}
  }
  depends_on = [google_project_service.apis]
}

# ─── Service Account ───────────────────────────────────────────────
resource "google_service_account" "app" {
  account_id   = "openhuman-app"
  display_name = "OpenHuman Application"
}

resource "google_project_iam_member" "app_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.app.email}"
}

resource "google_project_iam_member" "app_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.app.email}"
}

# ─── Cloud Run Service ─────────────────────────────────────────────
resource "google_cloud_run_v2_service" "app" {
  name     = "openhuman-${var.environment}"
  location = var.region

  template {
    service_account = google_service_account.app.email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/openhuman/app:latest"

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "2"
          memory = "1Gi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "NEXT_PUBLIC_APP_URL"
        value = "https://${var.domain}"
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }

      # Secrets
      dynamic "env" {
        for_each = {
          JWT_SECRET          = "openhuman-jwt-secret"
          WECHAT_PAY_API_KEY  = "openhuman-wechat-pay-api-key"
          WECHAT_PAY_MCH_ID   = "openhuman-wechat-pay-mch-id"
          ALIPAY_APP_ID       = "openhuman-alipay-app-id"
          ALIPAY_PRIVATE_KEY  = "openhuman-alipay-private-key"
          CRYPTO_WEBHOOK_SECRET = "openhuman-crypto-webhook-secret"
        }
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }

      startup_probe {
        http_get {
          path = "/api/health"
        }
        initial_delay_seconds = 5
        period_seconds        = 5
        failure_threshold     = 10
      }

      liveness_probe {
        http_get {
          path = "/api/health"
        }
        period_seconds = 30
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.app,
    google_secret_manager_secret.app_secrets,
  ]
}

# ─── Public Access ──────────────────────────────────────────────────
resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.app.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ─── Domain Mapping ────────────────────────────────────────────────
resource "google_cloud_run_domain_mapping" "domain" {
  count    = var.domain != "" ? 1 : 0
  name     = var.domain
  location = var.region
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.app.name
  }
}

# ─── Outputs ────────────────────────────────────────────────────────
output "service_url" {
  value = google_cloud_run_v2_service.app.uri
}

output "service_account_email" {
  value = google_service_account.app.email
}

output "artifact_registry" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/openhuman"
}
