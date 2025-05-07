
// Get all sections with class "a"
const sections = document.querySelectorAll('section.mt-4');
let outputContent = '';
let miscOutputContent = '';

sections.forEach((section, index) => {
const firstDiv = section.querySelector('div.container.article-section');
if (firstDiv) {
    const secondDiv = firstDiv.querySelector('div.row');
    if (secondDiv) {
        const paragraphs = secondDiv.querySelectorAll('p');
        // const joinedText = Array.from(paragraphs)
        //     .map(p => p.textContent.trim())
        //     .join(' ');
        paragraphs.forEach(p => {
            const text = p.textContent.trim();
        
            if (!p.hasAttribute('class')) { //pure article content
                outputContent += text + ' ';
            } else { //images or other content
                const className = p.className.trim() || 'unnamedClass';
                miscOutputContent += `<div class="${className}">${text}</div>`;
            }
            });
    } else {
        console.warn(`No .second-div found in .first-div of section ${index + 1}`);
    }
} else {
    console.warn(`No .first-div found in section ${index + 1}`);
}
});

document.body.innerHTML = '<p>' + outputContent + '</p>' + '<p>' + miscOutputContent + '</p>';
