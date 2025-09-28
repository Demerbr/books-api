resource "aws_ecr_repository" "books_api" {
  name                 = "${var.project_name}-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-repo"
  }
}

resource "aws_ecr_lifecycle_policy" "books_api" {
  repository = aws_ecr_repository.books_api.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# IAM Role para App Runner
resource "aws_iam_role" "apprunner_role" {
  name = "${var.project_name}-apprunner-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-apprunner-role"
  }
}

# Política para App Runner acessar ECR
resource "aws_iam_policy" "apprunner_ecr_policy" {
  name        = "${var.project_name}-apprunner-ecr-policy"
  description = "Policy for App Runner to access ECR"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-apprunner-ecr-policy"
  }
}

# Anexar política ao role
resource "aws_iam_role_policy_attachment" "apprunner_ecr" {
  role       = aws_iam_role.apprunner_role.name
  policy_arn = aws_iam_policy.apprunner_ecr_policy.arn
}

resource "aws_apprunner_service" "books_api" {
  service_name = "${var.project_name}-api"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_role.arn
    }
    
    image_repository {
      image_configuration {
        port = "3000"
        runtime_environment_variables = {
          PORT         = "3000"
          NODE_ENV     = "production"
          DATABASE_URL = "postgres://postgres:${var.db_password}@${aws_db_instance.postgres.endpoint}/booksdb"
          DB_POOL      = "10"
          FRONTEND_URL = var.frontend_url
        }
      }
      image_identifier      = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.id}.amazonaws.com/${var.project_name}-repo:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "0.25 vCPU"
    memory = "0.5 GB"
  }

  tags = {
    Name = "${var.project_name}-api"
  }
}

