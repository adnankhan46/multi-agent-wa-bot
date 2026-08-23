async function testToolSelection() {
  const aiService = new (require('./utils/aiService.js'))();
  
  const testCases = [
    { msg: "what is this pdf?", hasMedia: false, mediaType: null },
    { msg: "what is this pdf?", hasMedia: true, mediaType: "application/pdf" },
    { msg: "solve 2+2", hasMedia: false, mediaType: null },
    { msg: "write python code", hasMedia: false, mediaType: null }
  ];
  
  for (const test of testCases) {
    console.log(`\n🧪 Testing: "${test.msg}"`);
    const result = await aiService.selectTool(test.msg, test.hasMedia, false, test.mediaType);
    console.log(`✅ Result: ${result.name}`);
  }
}

// testToolSelection();