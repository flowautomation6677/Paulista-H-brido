# Deploy no Oracle Cloud

Como você já subiu o código, você precisa garantir que os arquivos de configuração do Docker que eu acabei de criar também estejam no servidor.

## Passos para fazer funcionar

1.  **Atualize os arquivos no servidor**:
    Certifique-se de que os seguintes arquivos (que eu acabei de criar/modificar) sejam enviados para a pasta do projeto no servidor:
    *   `Dockerfile`
    *   `docker-compose.yml`
    *   `next.config.ts` (modificado para `output: 'standalone'`)
    *   `.dockerignore`

2.  **Conecte-se ao servidor e vá para a pasta**:
    ```bash
    ssh ubuntu@SEU_IP
    cd /caminho/para/seu/projeto/headless-store
    ```

3.  **Inicie a aplicação**:
    Execute o comando para construir e subir o container:
    ```bash
    docker compose up -d --build
    ```

4.  **Verifique se está rodando**:
    ```bash
    docker compose ps
    ```
    Você deve ver o container `headless-store` rodando e redirecionando a porta `4000` para a `3000`.

5.  **Configure o Nginx Proxy Manager (NPM)**:
    Siga as instruções que você já tem:
    *   Acesse o painel do NPM (http://SEU_IP:81).
    *   Clique em "Proxy Hosts" -> "Add Proxy Host".
    *   **Domain Names**: seu-novo-dominio.com
    *   **Scheme**: http
    *   **Forward Hostname / IP**: `172.17.0.1` (IP do gateway do Docker) ou o IP privado do servidor.
    *   **Forward Port**: `4000` (A porta definida no docker-compose.yml).
    *   Marque "Block Common Exploits" e "Force SSL" (na aba SSL).

## Observações
- A porta `4000` foi configurada no `docker-compose.yml` para não conflitar com sua aplicação existente (Mepoupay) na porta 3000.
- O modo `standalone` foi ativado no `next.config.ts` para otimizar o container Docker.
