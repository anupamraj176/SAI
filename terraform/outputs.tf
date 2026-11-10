output "s3_bucket_name" {
  description = "Provisioned S3 bucket name for FarmerHub media uploads"
  value       = aws_s3_bucket.product_images.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the product media S3 bucket"
  value       = aws_s3_bucket.product_images.arn
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.farmerhub_server.id
}

output "ec2_public_ip" {
  description = "Public IPv4 address of the EC2 server (use as GitHub secret EC2_HOST)"
  value       = var.create_eip ? aws_eip.server_eip[0].public_ip : aws_instance.farmerhub_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS hostname of the EC2 server"
  value       = aws_instance.farmerhub_server.public_dns
}

output "ec2_iam_role_arn" {
  description = "Least-privilege IAM role attached to the EC2 instance for S3 access"
  value       = aws_iam_role.ec2_role.arn
}

