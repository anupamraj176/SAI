data "aws_vpc" "default" {
  default = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "server_sg" {
  name        = "${var.project_name}-${var.environment}-web-sg"
  description = "Allow HTTP, HTTPS, backend API, and SSH access"
  vpc_id      = data.aws_vpc.default.id

  tags = {
    Name = "${var.project_name}-${var.environment}-web-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.server_sg.id
  description       = "HTTP frontend traffic"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.server_sg.id
  description       = "HTTPS frontend traffic"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "backend_api" {
  security_group_id = aws_security_group.server_sg.id
  description       = "Direct backend API port"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 5001
  to_port           = 5001
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.server_sg.id
  description       = "SSH access for administration and CI/CD deploy"
  cidr_ipv4         = var.ssh_allowed_cidr
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "all_outbound" {
  security_group_id = aws_security_group.server_sg.id
  description       = "Allow all outbound traffic"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_key_pair" "deployer" {
  count      = var.ssh_public_key != "" ? 1 : 0
  key_name   = "${var.project_name}-${var.environment}-key"
  public_key = var.ssh_public_key
}

resource "aws_instance" "farmerhub_server" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = var.ssh_public_key != "" ? aws_key_pair.deployer[0].key_name : var.existing_key_name
  vpc_security_group_ids      = [aws_security_group.server_sg.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  associate_public_ip_address = true

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required" # Enforce IMDSv2
  }

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    encrypted             = true
    delete_on_termination = true
  }

  user_data = <<-EOF
              #!/bin/bash
              set -euo pipefail
              export DEBIAN_FRONTEND=noninteractive
              apt-get update -y
              apt-get install -y docker.io docker-compose-v2 curl
              systemctl enable --now docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "SAI-FarmerHub-Production-Server"
  }
}

resource "aws_eip" "server_eip" {
  count    = var.create_eip ? 1 : 0
  domain   = "vpc"
  instance = aws_instance.farmerhub_server.id

  tags = {
    Name = "${var.project_name}-${var.environment}-eip"
  }
}

