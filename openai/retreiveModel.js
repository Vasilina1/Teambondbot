// скрипт для получения имени новой натренировонной модели
// выполняется отдельно на сервере
// рекомендуемое время выполнения - через 30-60 минут после запуска тюнинга

const fs = require('fs');
const path = require('path');

const config = process.env.NODE_ENV === 'production' 
        ? require('../configProd.json') : require('../configDev.json')

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
  const fineTunes = await openai.listFineTunes();
  console.log(fineTunes.data)
  const modelsArray = fineTunes.data.data;
  if (modelsArray.length && modelsArray[modelsArray.length - 1].status === 'succeeded') {
    // если модель оттюнилась, скрипт запишет токен и
    // благодаря pm2 Ecosystem file мы увидим изменения в model.json и рестартуем процесс с новой моделью
    const newModel = {
      "fine_tuned_model": modelsArray[modelsArray.length - 1].fine_tuned_model
    }
    fs.writeFileSync(path.join(__dirname, 'model.json'), JSON.stringify(newModel))
  } else {
    console.log('ERROR: New model is not ready!')
    process.exit(1);
  }
})();