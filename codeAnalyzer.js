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
        console.error("----------------------------------------------");
        console.log("=======> FILE NAME: " +file.fileName);
        let result=analyzeJavaScriptSyntax(file.fileContent);
        console.log("Analysis result: ",result);
        result = detectErrors(file.fileContent);
        console.log("Rule Analysis result: ");
        result.forEach(res => console.log(res));
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

function detectErrors(code) {
  const detectedErrors = [];

  errorRules.forEach(rule => {
    if (rule.check(code)) {
      detectedErrors.push(rule.ruleId+": "+rule.description);
    }
  });

  return detectedErrors;
}

const errorRules = [
  {
    ruleId: "R1",
    description: "Error Rule 1: Replace this with the specific description",
    check: code => {
      return "Core rule check test";
    }
  },
  {
    ruleId: "R2",
    description: "Error Rule 2: Replace this with the specific description",
    check: code => {
      // Add the logic to check for the violation of this error rule
    }
  },
  // Add more error rules here
];



