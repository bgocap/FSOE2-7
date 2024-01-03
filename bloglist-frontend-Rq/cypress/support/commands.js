Cypress.Commands.add('resetDb', () => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
  })

Cypress.Commands.add('createUser', ({ username, name ,password }) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username, name , password
    })
})

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3001/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })
})

Cypress.Commands.add('addBlog', ({ title, author, url , likes }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: {title, author, url, likes},
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`
      }
  })
  cy.visit('http://localhost:3000')
})

