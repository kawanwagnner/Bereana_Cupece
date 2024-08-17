document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita o envio padrão do formulário

  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const cell = document.getElementById("phone").value;
  const assunto = document.getElementById("subject").value;
  const msg = document.getElementById("message").value;

  const data = { nome, email, cell, assunto, msg };

  fetch("http://localhost:8080/api/message/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) =>
      response.json().then((data) => ({ status: response.status, body: data }))
    )
    .then(({ status, body }) => {
      if (status === 400) {
        // Exibe a mensagem de erro do Joi
        Swal.fire({
          icon: "error",
          title: "Erro de Validação",
          text: body.msg, // Mensagem específica de validação
        });
      } else if (status === 200) {
        // Exibe a mensagem de sucesso
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: body.msg, // Mensagem de sucesso
        }).then(() => {
          // Limpa os campos do formulário após a confirmação
          document.getElementById("contactForm").reset();
        });
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      Swal.fire({
        icon: "error",
        title: "Erro de Sistema",
        text: "Houve um erro no servidor. O suporte já foi acionado.",
      });
    });
});
