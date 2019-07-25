FROM 122.114.200.217/base_images/nginx:1.16
MAINTAINER Hlone

ENV SITE_NAME fe_im_ibb_gainet_com
RUN mkdir -p /opt/webapplication/$SITE_NAME

ADD ${SITE_NAME}.tar.gz /opt/webapplication/$SITE_NAME/
EXPOSE 8011
CMD ["/usr/sbin/nginx","-g","daemon off;"]
