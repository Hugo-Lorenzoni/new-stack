#!/bin/sh
sleep 5

mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}
(mc ls local/${MINIO_BUCKET_NAME} >/dev/null 2>&1 || mc mb local/${MINIO_BUCKET_NAME})

cat <<EOF > /tmp/bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::${MINIO_BUCKET_NAME}",
        "arn:aws:s3:::${MINIO_BUCKET_NAME}/*"
      ]
    }
  ]
}
EOF

mc admin policy create local fullaccess-policy /tmp/bucket-policy.json
mc admin user add local ${MINIO_ACCESS_KEY} ${MINIO_SECRET_KEY}
mc admin policy attach local fullaccess-policy --user ${MINIO_ACCESS_KEY}
