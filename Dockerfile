FROM XX

EXPOSE 8080
ENTRYPOINT [ "apizilla" ]
# arguments that can be overridden
CMD [ "-path", "/etc/apizilla", "dev" ]