# Configure the AWS Provider
provider "aws" {
  region = "ap-south-1" # Mumbai Region
}

# 1. Create the S3 Bucket for Product Images
resource "aws_s3_bucket" "product_images" {
  bucket = "sai-farmerhub-images-${random_id.bucket_id.hex}"
}

# Generate a random ID so your bucket name is globally unique
resource "random_id" "bucket_id" {
  byte_length = 4
}

# 2. Make the bucket public so the Frontend can see the images
resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.product_images.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 3. Attach a policy that allows anyone on the internet to read (GET) the images
resource "aws_s3_bucket_policy" "allow_public_read" {
  bucket = aws_s3_bucket.product_images.id
  
  # Tell Terraform to WAIT until the public access block is removed!
  depends_on = [aws_s3_bucket_public_access_block.public_access]
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.product_images.arn}/*"
      },
    ]
  })
}


# 4. Output the bucket name so you know what it is called!
output "s3_bucket_name" {
  value = aws_s3_bucket.product_images.bucket
}
