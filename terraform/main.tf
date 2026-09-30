# ==========================================
# 5. AUTOMATED SECURITY GROUPS
# ==========================================
resource "aws_security_group" "server_sg" {
  name        = "farmerhub_web_sg"
  description = "Allow HTTP, SSH, and Backend ports"

  # Allow HTTP (Frontend)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Custom Backend Port
  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH (For you to log in)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outgoing internet traffic (so the server can download Docker)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==========================================
# 6. EC2 PROVISIONING & SERVER BOOTSTRAPPING
# ==========================================

# Dynamically find the latest Ubuntu 22.04 Image in AWS
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Official Canonical account ID
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Create the EC2 Server
resource "aws_instance" "farmerhub_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro" # Free Tier!
  
  # Attach the Security Group we just made
  vpc_security_group_ids = [aws_security_group.server_sg.id]

  # Server Bootstrapping: Run this bash script the second the server turns on
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io docker-compose
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "SAI-FarmerHub-Production-Server"
  }
}

# Output the public IP address of your new server!
output "ec2_public_ip" {
  value = aws_instance.farmerhub_server.public_ip
}
