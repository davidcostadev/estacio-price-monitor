import puppeteer, { Response } from 'puppeteer';

async function checkDataCouse() {
  try {
    const browser = await puppeteer.launch({ headless: true, devtools: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
    await page.goto('https://inscricoes.estacio.br');
    await page.waitFor(3000);
    await page.select('select', 'RN');
    // console.log('SELECTED');
    const [responseCursos] = await Promise.all([
      page.waitForResponse((response: Response): boolean => {
        return (
          !!response.url().match(/cursos[?]CodFormaIngresso/) &&
          response.request().method() === 'GET'
        );
      }),
      page.click('.modal-uf button.btn-block')
    ]);

    await page.waitFor(1000);

    await page.click('.form-busca-tab1-1 button');
    await page.type('.form-busca-tab1-1 .bs-searchbox input', 'ciências da computação');
    // console.log('TYPE CURSO');

    const [responseMunicipios] = await Promise.all([
      page.waitForResponse((response: Response): boolean => {
        return (
          !!response.url().match(/municipios[?]CodCurso=556/) &&
          response.request().method() === 'GET'
        );
      }),
      page.keyboard.press(String.fromCharCode(13))
    ]);
    // console.log('RESPNOSE MUNICIPIOS');
    // console.log(await responseMunicipios.text());
    await page.waitFor(1000);

    await page.click('.form-busca-tab1-2 button');
    await page.type('.form-busca-tab1-2 .bs-searchbox input', 'NATAL');
    // console.log('TYPE MUNICIEIO');

    const [responseCampus] = await Promise.all([
      page.waitForResponse((response: Response): boolean => {
        return (
          !!response.url().match(/campus[?]CodCurso=556/) && response.request().method() === 'GET'
        );
      }),
      page.keyboard.press(String.fromCharCode(13))
    ]);
    await page.waitFor(1000);
    // console.log(await responseCampus.text());

    await page.click('.form-busca-tab1-3 button');
    await page.type('.form-busca-tab1-3 .bs-searchbox input', 'ALEXANDRINO');
    // console.log('TYPE CAMPUS');
    await page.keyboard.press(String.fromCharCode(13));
    await page.waitFor(400);

    const [responseDados] = await Promise.all([
      page.waitForResponse((response: Response): boolean => {
        return (
          !!response.url().match(/dadoscurso[?]CodCampus=96&CodCurso=556/) &&
          response.request().method() === 'GET'
        );
      }),
      page.click('.form-busca-tab1-0 button')
    ]);
    await page.waitFor(1000);
    console.log(new Date().toISOString(), 'scrap finished');
    const dados = JSON.parse(await responseDados.text());

    const [modalidade] = dados.ListaModalidades;
    // dados.ListaModalidades.forEach(curso => {
    //   console.log('-'.repeat(30));
    //   console.log('NomeTurno:'.padStart(19), curso.NomeTurno);
    //   console.log('DescontoPercentual:'.padStart(19), curso.DescontoPercentual);
    //   console.log('ValorDe:'.padStart(19), curso.ValorDe);
    //   console.log('ValorPara:'.padStart(19), curso.ValorPara);
    // });

    await page.screenshot({ path: 'prints/01.png' });

    await browser.close();
    return {
      discount: modalidade.DescontoPercentual,
      from: modalidade.ValorDe,
      to: modalidade.ValorPara
    };
  } catch (error) {
    console.error(error);
    // await browser.close();
  }
}

export default checkDataCouse;
