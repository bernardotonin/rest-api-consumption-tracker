# rest-api-consumption-tracker
Essa API é o back-end de um serviço que gerencia a leitura individualizada de consumo de água e gás. Para facilitar a coleta da informação, o serviço utiliza IA para obter a medição através da foto de um medidor.
# Endpoints
**POST /upload** <br>
<br>
Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API

Request Body:

    { 
        "image": "base64", 
        "customer_code": "string", 
        "measure_datetime": "datetime", 
        "measure_type": "WATER" ou "GAS"
    }
**PATCH /confirm**<br> 
<br>
Responsável por confirmar ou corrigir o valor lido pelo LLM.

Request body:

    { 
        "measure_uuid": "string", 
        "confirmed_value": integer 
    }
**GET /<customer_code>/list** <br>
<br>
Responsável por retornar uma lista de medidas de um determinado cliente.

Query parameter opcional: ?measure_type= WATER ou GAS
