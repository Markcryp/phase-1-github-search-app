document.addEventListener('DOMContentLoaded', () => {
    const userSearchForm = document.getElementById('user-search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const reposContainer = document.getElementById('repos-container');
    const searchTypeToggle = document.getElementById('search-type-toggle');
    
    let currentSearchType = 'user'; // or 'repo'
  
    const fetchGitHubData = async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    const displayUsers = (users) => {
      resultsContainer.innerHTML = '';
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-card';
        userDiv.innerHTML = `
          <h2>${user.login}</h2>
          <img src="${user.avatar_url}" alt="${user.login}" width="100" />
          <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userDiv.addEventListener('click', () => fetchAndDisplayRepos(user.login));
        resultsContainer.appendChild(userDiv);
      });
    };
  
    const displayRepos = (repos) => {
      reposContainer.innerHTML = '';
      repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repo-card';
        repoDiv.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description'}</p>
          <a href="${repo.html_url}" target="_blank">Repository</a>
        `;
        reposContainer.appendChild(repoDiv);
      });
    };
  
    const fetchAndDisplayRepos = async (username) => {
      const repos = await fetchGitHubData(`https://api.github.com/users/${username}/repos`);
      displayRepos(repos);
    };
  
    const handleSearch = async (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
  
      if (currentSearchType === 'user') {
        const usersData = await fetchGitHubData(`https://api.github.com/search/users?q=${query}`);
        displayUsers(usersData.items);
        reposContainer.innerHTML = ''; // Clear repo results
      } else {
        const reposData = await fetchGitHubData(`https://api.github.com/search/repositories?q=${query}`);
        displayRepos(reposData.items);
        resultsContainer.innerHTML = ''; // Clear user results
      }
    };
  
    userSearchForm.addEventListener('submit', handleSearch);
  
    searchTypeToggle.addEventListener('click', () => {
      currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
      searchTypeToggle.textContent = currentSearchType === 'user' ? 'Search Repos' : 'Search Users';
      resultsContainer.innerHTML = ''; // Clear previous results
      reposContainer.innerHTML = ''; // Clear previous results
    });
  });
  