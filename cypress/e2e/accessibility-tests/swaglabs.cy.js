/// <reference types="cypress"/>

describe('accessibility test automation with cypress axe', () => {

    const a11YOptions = {
        runOnly: {
            type: 'tag',
            values: ['wcag2aa', 'section508']
        }
    }

    function terminalLog(violations) {
        cy.task(
            'log',
            `${violations.length} accessibility violation${
                violations.length === 1 ? '' : 's'
            } ${violations.length === 1 ? 'was' : 'were'} detected`
        )
        // pluck specific keys to keep the table readable
        const violationData = violations.map(
            ({ id, impact, description, nodes }) => ({
                id,
                impact,
                description,
                nodes: nodes.length
            })
        )

        cy.task('table', violationData)
    }


    beforeEach(() => {
        cy.visit('https://www.saucedemo.com')
        cy.injectAxe()
        cy.configureAxe({
            branding: {
                brand: "Swag Labs",
                application: "Swag Labs Demo App"
            },
            reporter: "v2",
            iframes: true,
        })
    })

    it('Swag Labs Login Page Check', () => {
        cy.contains('Login').should('be.visible')
        cy.checkA11y()
    })

    it('Swag Labs Home Page Check', () => {
        cy.get('[data-test="username"]').should('be.visible').should('be.enabled').type("standard_user")
        cy.get('[data-test="password"]').should('be.visible').should('be.enabled').type("secret_sauce")
        cy.get('[data-test="login-button"]').should('be.visible').should('be.enabled').click()
        cy.contains('Open Menu').should('be.visible')
        cy.checkA11y();
    })

    it('Check home page with selected a11y standards', () => {
        // Test the page at initial load (with context and options)
        cy.get('[data-test="username"]').should('be.visible').should('be.enabled').type("standard_user")
        cy.get('[data-test="password"]').should('be.visible').should('be.enabled').type("secret_sauce")
        cy.get('[data-test="login-button"]').should('be.visible').should('be.enabled').click()
        cy.contains('Open Menu').should('be.visible')
        cy.checkA11y(null, a11YOptions)
    })

    it('Check home page with selected a11y standards for selected element', () => {
        // Test the page at initial load (with context and options)
        cy.get('[data-test="username"]').should('be.visible').should('be.enabled').type("standard_user")
        cy.get('[data-test="password"]').should('be.visible').should('be.enabled').type("secret_sauce")
        cy.get('[data-test="login-button"]').should('be.visible').should('be.enabled').click()
        cy.contains('Open Menu').should('be.visible')
        cy.checkA11y('.inventory_container', a11YOptions)
    })

    it('Check home page and log violation with a custom logger', () => {
        // Test the page at initial load (with context and options)
        cy.get('[data-test="username"]').should('be.visible').should('be.enabled').type("standard_user")
        cy.get('[data-test="password"]').should('be.visible').should('be.enabled').type("secret_sauce")
        cy.get('[data-test="login-button"]').should('be.visible').should('be.enabled').click()
        cy.contains('Open Menu').should('be.visible')
        cy.checkA11y(null, a11YOptions, terminalLog)
    })

    it('Check home page and log violation without failing the test', () => {
        // Test the page at initial load (with context and options)
        cy.get('[data-test="username"]').should('be.visible').should('be.enabled').type("standard_user")
        cy.get('[data-test="password"]').should('be.visible').should('be.enabled').type("secret_sauce")
        cy.get('[data-test="login-button"]').should('be.visible').should('be.enabled').click()
        cy.contains('Open Menu').should('be.visible')
        cy.checkA11y(null, a11YOptions, null, true)
    })
})