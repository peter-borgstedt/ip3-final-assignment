build:
	@echo '-> Bundling (copying files)'
	@rm -rf dist
	@mkdir dist
	@cp -r scripts dist
	@cp -r libraries dist
	@cp -r fonts dist
	@cp -r assets dist
	@cp index.html dist
	@cp index.css dist
	@cp worker.js dist
	@perl -i -pe 's/data-environment="dev"/data-environment="prod"/g' dist/index.html

deploy: export AWS_PROFILE = ip-chat
deploy: build
	@echo '-> Deploying (copying to S3)'
	@aws s3 cp dist s3://ip-chat-web/ --recursive --acl public-read --metadata '{"Cache-Control":"no-cache, no-store"}'

open:
	open "https://d31k87hzkjbg8d.cloudfront.net"
