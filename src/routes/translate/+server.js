import { json } from '@sveltejs/kit'
import { pipeline} from '@xenova/transformers'


async function translate(text, language, languageTo) {
    let translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
    let output = await translator(text,{
        src_lang: language, 
        tgt_lang: languageTo,
    })
    return output
}

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const { text, language, languageTo  } = await request.json()
    try {
        const result = await translate(text, language, languageTo)
        const output = result[0].translation_text
        return json({output},{status: 201})
    } catch (error) {
        console.log(error)
        return json({error},{status:500})
    }
};