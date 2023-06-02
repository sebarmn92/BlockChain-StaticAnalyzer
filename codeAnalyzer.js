let files = [];

function downloadGitHubRepository(url) {
  // Extract the repository owner and name from the URL
  let regex = /github\.com\/([^/]+)\/([^/]+)/;
  let match = url.match(regex);
  if (!match || match.length < 3) {
    console.error('Invalid GitHub repository URL');
    return;
  }
  let owner = match[1];
  let repoName = match[2];
  console.log("owner: "+owner+" and repoName: "+repoName);
  openAllFilesFromGitHubRepo(owner, repoName);
}


function openAllFilesFromGitHubRepo(repoOwner, repoName, path = '') {
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function(contents) {
        contents.forEach(function(fileData) {
          if (fileData.type === 'file') {
            // Process file content
          //  console.log(fileData);
            if (fileData) {
              //  console.log(fileData);
                readTSFileFromURL(fileData.download_url, fileData.name);
                
              } 
          } else if (fileData.type === 'dir') {
            // Recursively process directory
            openAllFilesFromGitHubRepo(repoOwner, repoName, fileData.path);
          }
        });
      })
      .catch(function(error) {
        console.error('Error:', error);
      });

      files.forEach(file =>{
        console.error(file.fileName);
        let result=analyzeJavaScriptSyntax(file.fileContent);
        console.log("Analysis result: ",result);
       // analyzeSmartContract(fileContent);
    })
      
  }

  function analyzeJavaScriptSyntax(code) {
    var syntaxAnalysis = {
      hasVariableDeclarations: /(?:var|let|const)\s+\w+/g.test(code),
      hasFunctionDeclarations: /function\s+\w+/g.test(code),
      hasArrowFunctions: /(?:\w+\s*=\s*)?\(.*?\)\s*=>/g.test(code),
      hasObjectLiterals: /{.*?}/g.test(code),
      hasArrayLiterals: /\[.*?\]/g.test(code),
      hasTemplateLiterals: /`.*?`/g.test(code),
      hasClassDeclarations: /class\s+\w+/g.test(code),
      hasAsyncFunctions: /async\s+function/g.test(code)
    };
    return syntaxAnalysis;
  }

  function readTSFileFromURL(fileURL, fileName) {
    let content = "";
    fetch(fileURL)
      .then(function(response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function(fileContent) {
        // Process the TypeScript file content
        files.push({fileName:fileName, fileContent:fileContent});
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
      
  }
  
  document.getElementById('url-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const url = document.getElementById('url-input').value;
    console.log(url); // Replace with your desired handling of the URL
    downloadGitHubRepository(url);
  });

