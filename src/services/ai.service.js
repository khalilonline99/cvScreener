export async function extractWithAI(text) {
    const prompt = `
Extract structured information from the CV below.

Return ONLY valid JSON in this format:
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [
    {
      "role": "",
      "company": "",
      "years": 0
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ]
}

CV:
${text}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "kimi-k2.5:cloud",
            prompt,
            stream: false,
        }),
    });

    const data = await response.json();

    try {
        // return JSON.parse(data.response);

        //----------if the above dont work, will replace with below, only the try part---------
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON found in AI response");
        }
        const cleanJson = jsonMatch[0];
        return JSON.parse(cleanJson);
    }
    catch (err) {
        console.error("❌AI JSON parse failed:\n", data.response);
        console.log('❌AI JSON parse error given on ai service file');

        throw new Error("AI returned invalid JSON");
    }
}