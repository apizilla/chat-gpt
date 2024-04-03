let output = {}

console.log(JSON.stringify({
    name: "chat-gpt-save",
    request: request,
    user: user,
    config: config,
    params: request.params
}))

let id = request.params.id !== undefined && request.params.id !== null ? request.params.id : null;

try {
    if (id !== null) {
        let runOutput = run("chat-gpt-save-update", {
            "id": id,
            //other params are build within insert query, you don't need to pass them here
        })
        output.result = runOutput
    } else {
        let runOutput = run("chat-gpt-save-insert", {
            //other params are build within insert query, you don't need to pass them here
            "publicId": uuid()
        })
        output.result = runOutput
    }
} catch (e) {
    console.log(JSON.stringify(e))
    throw e
}

setStatusCode(200)
setResult(output)
