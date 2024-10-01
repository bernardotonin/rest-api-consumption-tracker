
# API de Gerenciamento de Leitura de Consumo de Água e Gás

Esta API gerencia a leitura individualizada de consumo de água e gás, permitindo o upload de imagens dos medidores, a leitura automática via **OCR** utilizando a API do **Google Gemini**, e o gerenciamento das medidas.

## Funcionalidades

-   Receber uma imagem em **Base64** e utilizar a API do **Google Gemini** para extrair o valor de consumo (via OCR).
-   Confirmar ou corrigir o valor lido automaticamente.
-   Listar as medidas registradas para um determinado cliente.

## Endpoints

### 1. POST `/upload`

Este endpoint é responsável por receber uma imagem em **Base64**, consultar a API do **Google Gemini** e retornar o valor lido.

#### Request Body:

    {
        "image": "base64",
        "customer_code": "string",
        "measure_datetime": "datetime",
        "measure_type": "WATER" ou "GAS"
    }

#### Response (Exemplo de Sucesso):

    {
        "image_url": "url_da_imagem_armazenada",
        "measure_value": "valor_lido",
        "measure_uuid": "uuid_da_medida"
    }

#### Response (Erro de OCR com Gemini):

    {
        "error": "Error with Gemini LLM",
        "error_description": "Check your api key"
    }

#### Response (Erro de leitura duplicada):

    {
        "error_code": "DOUBLE_REPORT",
        "error_description": "Leitura desse mês já realizada!"
    }

----------

### 2. PATCH `/confirm`

Este endpoint permite confirmar ou corrigir o valor lido automaticamente pelo OCR.

#### Request Body:

    {
        "measure_uuid": "string",
        "confirmed_value": "integer"
    }

#### Response (Exemplo de Sucesso):


    {
        "success": true
    }

#### Response (Erro - Medida não encontrada):

`{
    "error_code": "MEASURE_NOT_FOUND",
    "error_description": "Medição não encontrada!"
}` 

#### Response (Erro - Leitura já confirmada):

    {
        "error_code": "CONFIRMATION_DUPLICATE",
        "error_description": "Leitura já confirmada!"
    }

----------

### 3. GET `/:customer_code/list`

Este endpoint retorna uma lista de medidas de um cliente específico, com um parâmetro opcional para filtrar por tipo de medida (água ou gás).

#### Query Parameters (Opcional):

-   `measure_type=WATER` ou `GAS`

#### Response (Exemplo de Sucesso):

    [
        {
            "measure_uuid": "string",
            "customer_code": "string",
            "measure_type": "WATER" ou "GAS",
            "measure_value": "integer",
            "measure_datetime": "datetime",
            "status": "CONFIRMED" ou "PENDING"
        }
    ]

#### Response (Erro - Usuário não encontrado):

    {
        "error_code": "USER_NOT_FOUND",
        "error_description": "Esse usuário não existe!"
    }

#### Response (Erro - Nenhuma leitura encontrada):


    {
        "error_code": "MEASURES_NOT_FOUND",
        "error_description": "Nenhuma leitura encontrada!"
    }
