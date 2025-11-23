// URL DO APPS SCRIPT
const API = "YOUR_WEBAPP_URL_HERE";

// Buscar autorizações
document.getElementById("btnBuscar").onclick = async function () {
    const cnpj = document.getElementById("cnpj").value.trim();
    const status = document.getElementById("statusBusca");

    if (!cnpj) {
        status.textContent = "Digite um CNPJ válido.";
        return;
    }

    status.textContent = "Buscando autorizações...";

    const res = await fetch(API + "?acao=buscar&cnpj=" + encodeURIComponent(cnpj));
    const data = await res.json();

    if (data.erro) {
        status.textContent = data.erro;
        return;
    }

    status.textContent = "Autorização encontrada. Preencha o relatório.";

    // mostrar formulário
    document.getElementById("formRelatorio").classList.remove("hidden");

    // ativar seções
    const seções = [
        "aat", "tb_bov", "b19", "rb51", "raiva", "pasta"
    ];

    seções.forEach(s => {
        const div = document.getElementById("sec_" + s);
        if (data[s] === "SIM") div.classList.remove("hidden");
        else div.classList.add("hidden");
    });
};

// Enviar formulário
document.getElementById("formRelatorio").onsubmit = async function (e) {
    e.preventDefault();

    const form = new FormData(this);
    form.append("acao", "enviar");
    form.append("cnpj", document.getElementById("cnpj").value);

    const res = await fetch(API, {
        method: "POST",
        body: form
    });

    const txt = await res.text();

    alert("Relatório enviado com sucesso.\nUma cópia será enviada por e-mail.");
    this.reset();
};
