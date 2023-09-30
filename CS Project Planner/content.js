let currentURL = window.location.href;

const urlObserver = new MutationObserver(() => {
  const newURL = window.location.href;

  if (newURL !== currentURL) {
    currentURL = newURL;

    const aboutJobElement = [...document.querySelectorAll('h2')].find(element => element.textContent.trim() === "About the job");

    const postedOnElement = [...document.querySelectorAll('p')].find(element => element.textContent.includes("Posted on"));

    if (aboutJobElement && postedOnElement) {
      const jobDescription = extractTextBetweenElements(aboutJobElement, postedOnElement);

      const skillsMap = extractSkillsFromText(jobDescription);

      chrome.runtime.sendMessage({ skills: skillsMap });

      fetch('http://localhost:8000/store-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills: skillsMap }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Skills stored successfully in the database");
        })
        .catch((error) => {
          console.error("Error storing skills in the database:", error);
        });
    }
  }
});

urlObserver.observe(document.querySelector('title'), {
  subtree: true,
  characterData: true,
  childList: true
});

function extractTextBetweenElements(startElement, endElement) {
  let currentElement = startElement.nextElementSibling;
  const textContent = [];

  while (currentElement && currentElement !== endElement) {
    textContent.push(currentElement.textContent.trim());
    currentElement = currentElement.nextElementSibling;
  }

  return textContent.join('\n');
}

const commonSkills = [
  "Java",
  "Python",
  "JavaScript",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "AWS",
  "Node.js",
  "Go",
  "Rust",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "Git",
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "Linux",
  "Spring Framework",
  "RESTful API",
  "TensorFlow",
  "PyTorch",
  "Blockchain",
  "Cybersecurity",
  "Big Data",
  "DevOps",
  "Scala",
  "Vue.js",
  "Azure",
  "AI/ML"
];

function extractSkillsFromText(text) {
  const skillsMap = {};

  const lowercasedText = text.toLowerCase();
  const words = lowercasedText.split(/\s+/);

  words.forEach((word) => {
    const skill = commonSkills.find((skill) => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill.toLowerCase()}\\b`, "g");
      return regex.test(word);
    });

    if (skill) {
      if (skillsMap[skill]) {
        skillsMap[skill] += 1; // Increment by 1 if the skill is already in the map
      } else {
        skillsMap[skill] = 1; // Initialize to 1 if the skill is not in the map
      }
    }
  });

  return skillsMap;
}

function sendTestData() {
  const testJobDescription = "This is a test job description with Python, Python, and Python.";
  const testSkillsMap = extractSkillsFromText(testJobDescription);
  
  chrome.runtime.sendMessage({ skills: testSkillsMap });
}

sendTestData();
