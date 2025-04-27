```shell
# Start PostgreSQL Database and PSPDFKit Server
$ docker-compose up

# Upload `document.pdf` and assign it "APPROVAL_REQUEST” id
$ curl -X POST http://localhost:5000/api/documents/ \
   -H "Authorization: Token token=<secret token>" \
   -F "file=@document.pdf" \
   -F "document_id=APPROVAL_REQUEST"

# Add an "Approved" stamp
$ curl -X POST http://localhost:5000/api/documents/APPROVAL_REQUEST/annotations \
   -H "Authorization: Token token=<secret token>" \
   -d '{"content":{"stampType": "Approved", "pageIndex": 1, "bbox": [146, 383, 24, 24], ...}, "type": "pspdfkit/stamp"}'

# Fetch the flattened PDF file (saving it to document-flattened.pdf)
$ curl -o document-flattened.pdf http://localhost:5000/api/documents/APPROVAL_REQUEST/pdf?flatten=true \
   -H "Authorization: Token token=<secret token>"
```
