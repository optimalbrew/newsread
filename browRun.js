(function() {
  // Find the script tag with id "__NEXT_DATA__"
  const scriptElement = document.getElementById('__NEXT_DATA__');
  
  if (!scriptElement) {
      console.error('__NEXT_DATA__ script tag not found');
      return;
  }
  
  try {
      // Parse the JSON content from script element
      const jsonData = JSON.parse(scriptElement.textContent);
      
      // Check if the expected structure exists
      if (jsonData.props && jsonData.props.pageProps && jsonData.props.pageProps.story) {
          const story = jsonData.props.pageProps.story;
          console.log('Story object found with keys:', Object.keys(story));
          
          if (story.body && story.body.content) {
              console.log('Found body.content');
              
              // Extract text from the content structure
              const extractedText = extractTextFromContent(story.body.content);
              
              console.log(`Extracted ${extractedText.length} characters`);
              
              // Insert the extracted text into the document body
              document.body.innerHTML = `
                  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; line-height: 1.6; background: white; color: black;">
                      <h1 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Extracted Article Text</h1>
                      <div style="white-space: pre-wrap; font-size: 16px;">${extractedText}</div>
                      <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 14px; color: #666;">
                          <strong>Character count:</strong> ${extractedText.length}
                      </div>
                  </div>
              `;
              
              return extractedText;
          } else {
              console.error('No body.content found in story object');
              return null;
          }
      } else {
          console.error('Expected data structure not found');
          return null;
      }
  } catch (e) {
      console.error('Error parsing __NEXT_DATA__:', e.message);
      return null;
  }
  
  // Helper function to extract text from Next.js content structure
  function extractTextFromContent(content) {
      let text = '';
      
      if (Array.isArray(content)) {
          content.forEach(item => {
              text += extractTextFromContent(item);
          });
      } else if (typeof content === 'object' && content !== null) {
          // Handle the specific structure we found: {type: "paragraph", content: [...]}
          if (content.type === 'paragraph' && content.content) {
              // Check if this paragraph contains "Read More:" text
              const paragraphText = extractTextFromContent(content.content);
              if (paragraphText.includes('Read More:')) {
                  // Skip this paragraph
                  return '';
              }
              text += paragraphText;
          } else if (content.type === 'text' && content.value) {
              text += content.value + ' ';
          } else if (content.text) {
              text += content.text + ' ';
          } else if (content.content) {
              text += extractTextFromContent(content.content);
          } else if (content.children) {
              text += extractTextFromContent(content.children);
          } else if (content.value) {
              text += content.value + ' ';
          }
      } else if (typeof content === 'string') {
          text += content + ' ';
      }
      
      return text;
  }
})();
