FROM apizilla/apizilla:v0.5.9

EXPOSE 8080
ENTRYPOINT [ "apizilla" ]
# arguments that can be overridden
CMD [ "-path", "/etc/apizilla", "dev" ]