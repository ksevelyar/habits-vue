export default {
  async getGithubProfile(profile) {
    const response = await fetch(`https://api.github.com/users/${profile}`)
    const json = await response.json()

    console.log(json)
  }
}
