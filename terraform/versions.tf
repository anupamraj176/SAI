terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Optional: Uncomment after creating a dedicated S3 state bucket in your new AWS account,
  # then run: terraform init -migrate-state
  # backend "s3" {
  #   bucket       = "YOUR_TERRAFORM_STATE_BUCKET"
  #   key          = "farmerhub/prod/terraform.tfstate"
  #   region       = "ap-south-1"
  #   encrypt      = true
  #   use_lockfile = true
  # }
}

