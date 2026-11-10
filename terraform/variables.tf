variable "aws_region" {
  description = "AWS region to deploy infrastructure into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project identifier used for resource naming and tags"
  type        = string
  default     = "farmerhub"
}

variable "environment" {
  description = "Deployment environment label"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type (t3.micro or t2.micro for AWS Free Tier)"
  type        = string
  default     = "t3.micro"
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH into EC2 (restrict to YOUR_PUBLIC_IP/32 in production)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "ssh_public_key" {
  description = "Optional SSH public key content to create an EC2 key pair for SSH and GitHub Actions deploy"
  type        = string
  default     = ""
}

variable "existing_key_name" {
  description = "Optional existing EC2 Key Pair name in AWS (ignored if ssh_public_key is provided)"
  type        = string
  default     = null
}

variable "s3_bucket_prefix" {
  description = "Prefix for the globally unique product media S3 bucket"
  type        = string
  default     = "sai-farmerhub-images"
}

variable "s3_force_destroy" {
  description = "Allow terraform destroy to delete non-empty S3 bucket (keep false in production)"
  type        = bool
  default     = false
}

variable "cors_allowed_origins" {
  description = "Allowed origins for S3 bucket CORS configuration"
  type        = list(string)
  default = [
    "http://localhost:5173",
    "http://localhost:30080",
    "https://farmerhub-henna.vercel.app"
  ]
}

variable "create_eip" {
  description = "Allocate a static Elastic IP for the EC2 instance"
  type        = bool
  default     = false
}

