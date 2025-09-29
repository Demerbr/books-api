resource "aws_iam_user" "github_actions" {
  name = "${var.project_name}-github-actions"
  path = "/"

  tags = {
    Name        = "${var.project_name}-github-actions"
    Purpose     = "GitHub Actions CI/CD"
    Environment = "production"
  }
}

resource "aws_iam_policy" "ecr_policy" {
  name        = "${var.project_name}-github-ecr-policy"
  description = "Policy for GitHub Actions to access ECR"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-github-ecr-policy"
  }
}

resource "aws_iam_policy" "apprunner_policy" {
  name        = "${var.project_name}-github-apprunner-policy"
  description = "Policy for GitHub Actions to manage App Runner"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "apprunner:StartDeployment",
          "apprunner:DescribeService",
          "apprunner:ListServices"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-github-apprunner-policy"
  }
}

resource "aws_iam_user_policy_attachment" "github_ecr" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.ecr_policy.arn
}

resource "aws_iam_user_policy_attachment" "github_apprunner" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.apprunner_policy.arn
}

resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}

output "github_aws_access_key_id" {
  value       = aws_iam_access_key.github_actions.id
  description = "AWS Access Key ID para configurar no GitHub Secrets"
  sensitive   = false
}

output "github_aws_secret_access_key" {
  value       = aws_iam_access_key.github_actions.secret
  description = "AWS Secret Access Key para configurar no GitHub Secrets"
  sensitive   = true
}

output "github_user_arn" {
  value       = aws_iam_user.github_actions.arn
  description = "ARN do usuário IAM criado para GitHub Actions"
}
