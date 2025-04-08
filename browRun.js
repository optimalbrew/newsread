//"Complete" is an attempt to get all paragraph data, including those where the text is inside an entity property
/* Assuming your script tag is something like this:

<script id="targetScript" type="application/json">
  {"name": "John", "age": 30, "location": {"city": "New York", "country": "USA"}}
</script>
*/

// Replace 'targetScript' with your actual script element ID
const scriptElement = document.getElementById('__NEXT_DATA__'); //this is the tag we're looking for

if (scriptElement) {
  try {
    // Parse the JSON content from script element
    const jsonData = JSON.parse(scriptElement.textContent);

    // Specify fields you're interested in here
    const selectedData = {
      aiSummary: jsonData.props.pageProps.story.aiSummary.text,
      body: jsonData.props.pageProps.story.body.content,
    };

    // selectedData.body contains some elements of type paragraph 
    const paragraphs = selectedData.body.filter(item => item.type === 'paragraph');
    
    // the paragraphs are themselves arrays of objects, so we need to go through each one
    // This will also include the text from any entities that are part of the paragraph
    const paragraphTexts = paragraphs.map(item => item.content.map(
      /** BUG: the order matters. If we switch to 'text' first and 'entity' later, then `c.content` is undefined. 
       * but console.log still shows the text.
       * not sure why this happens. Not debugging it for now. 
      */
      c => {
        if (c.type === 'entity') {
          //console.log(c.content[0].value);
          return c.content[0].value; // Assuming the entity has a 'value' property
        } else if (c.type = 'text') {
          return c.value;
        } else {
          return '';
        }
      }
    ).join(' ')).join(' '); 

    //console.log(paragraphTexts);
    selectedData.body = paragraphTexts;
    // Use <pre> instead of <p> for better readability if the output really is pre-structured JSON
    document.body.innerHTML = '<p>' + JSON.stringify(selectedData, null, 2) + '</p>';

    //console.log(selectedData);

  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
} else {
  console.error('Script element not found!');
}
