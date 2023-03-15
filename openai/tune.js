// скрипт тюнинга
// выполняется на сервере

const fs = require("fs");
const config = process.env.NODE_ENV === 'production' 
        ? require('../configProd.json') : require('../configDev.json')

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
  const file = await openai.createFile(
    fs.createReadStream("./trainingData.jsonl"),
    "fine-tune"
  );
  console.log(file.data.id);

  const response = await openai.createFineTune({
    training_file: file.data.id,
  });
  
  console.log(response.data);
})();