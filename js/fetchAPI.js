document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita o envio padrão do formulário

  const nome = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const cell = document.getElementById("phone").value;
  const assunto = document.getElementById("subject").value;
  const msg = document.getElementById("message").value;

  const data = {
    nome: nome,
    email: email,
    cell: cell,
    assunto: assunto,
    msg: msg,
  };

  fetch("http://localhost:8080/api/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Sucesso:", data);
      // Aqui você pode adicionar um feedback ao usuário, como uma mensagem de sucesso
    })
    .catch((error) => {
      console.error("Erro:", error);
      // Aqui você pode adicionar um feedback ao usuário, como uma mensagem de erro
    });
});
