---
---

user = new User "adorow"

onSuccess = (repos) ->
  repos.sort(_byScore)

  _addTile(createTile(repo, i)) for repo, i in repos

  _collapseAnimation()

onFailure = () ->
  _collapseAnimation()

  _displayLoadingError()

_displayLoadingError = () ->
  document.getElementById('projects-error').classList.remove('hidden')

_collapseAnimation = () ->
  _loadingImage().classList.add('animate-collapse')

_addTile = (tile) ->
  _projectsContainer().appendChild(tile)
  tile

_loadingImage = () ->
  document.getElementsByClassName('loading-projects')[0]

_projectsContainer = () ->
  document.getElementsByClassName('projects')[0]

_byScore = (a, b) ->
  b.score() - a.score()

loadRepositories(user, onSuccess, onFailure)
