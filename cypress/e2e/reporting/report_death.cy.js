/// <reference types="cypress" />


describe('Reporting Death', () => {

    before('login ', () => {
        cy.visit('https://ekram-md.org/service-catalog')

        cy.get('.identity').click()

        cy.fixture('login_data/users.json').then((user) => {
            if (user) {
                cy.get('#username').type(user.username || ''); // Using empty string as fallback
                cy.get('#password').type(user.password || ''); // Using empty string as fallback
            } else {
                // Handle the case where the file couldn't be read or is empty
                // For example, log an error
                cy.log('Error: Unable to read user data from file');
            }
        });

        cy.get('#kc-form-login-simple > #kc-form-buttons > #kc-login').click()

    })
    it('Report', () => {

        cy.get('.app-service-card-list .app-service-card .col-auto .ng-star-inserted').eq(0).click()

        cy.get('.services-categorey-accordion .card-body .accordion-widget').eq(0).click()

        cy.wait(3000)

        cy.get('.btn').click()

        cy.wait(3000)

        cy.fixture('case/case.json').then((cases) => {

            if (cases.relate == 'no') {
                cy.get(".form-check-input").eq(11).should("have.value", 'no').click({
                    force: true
                })
            } else {
                cy.get(".form-check-input").eq(10).click()

                cy.get("div.form-control").eq(3).click().then(() => {
                    if (cases.relation == 'father') {
                        cy.get('#choices--requesterRelation-item-choice-1').click({ force: true })
                    } else if (cases.relation == 'mother') {
                        cy.get('#choices--requesterRelation-item-choice-2').click({ force: true })
                    } else if (cases.relation == 'son') {
                        cy.get('#choices--requesterRelation-item-choice-3').click({ force: true })
                    } else if (cases.relation == 'daughter') {
                        cy.get('#choices--requesterRelation-item-choice-4').click({ force: true })
                    } else if (cases.relation == 'brother') {
                        cy.get('#choices--requesterRelation-item-choice-5').click({ force: true })
                    } else if (cases.relation == 'sister') {
                        cy.get('#choices--requesterRelation-item-choice-6').click({ force: true })
                    } else if (cases.relation == 'wife') {
                        cy.get('#choices--requesterRelation-item-choice-7').click({ force: true })
                    } else if (cases.relation == 'husband') {
                        cy.get('#choices--requesterRelation-item-choice-8').click({ force: true })
                    } else if (cases.relation == 'friend') {
                        cy.get('#choices--requesterRelation-item-choice-9').click({ force: true })
                    } else if (cases.relation == 'Workfriend') {
                        cy.get('#choices--requesterRelation-item-choice-10').click({ force: true })
                    } else if (cases.relation == 'sponsor') {
                        cy.get('#choices--requesterRelation-item-choice-11').click({ force: true })
                    } else if (cases.relation == 'other') {
                        cy.get('#choices--requesterRelation-item-choice-12').click({ force: true })
                        cy.get('#requesterActualRelation').type('غير ذالك')
                    }

                })
            }
            if (cases.Identification == 'Citizen') {

                cy.get(".form-check-input").eq(12).should("have.value", 'citizen').click({
                    force: true
                })
                cy.get('#idNumber').type('1061735047')

                cy.get('.input-group > .input').eq(0).type('1984-01-25{enter}')

                cy.get('#nafathSync').click()
                
            } else if (cases.Identification == 'Resident') {

                cy.get(".form-check-input").eq(13).click({
                    force: true
                })

            } else if (cases.Identification == 'Visitor') {

                cy.get(".form-check-input").eq(14).click({
                    force: true
                })

            } else if (cases.Identification == 'Umrah') {

                cy.get(".form-check-input").eq(15).click({
                    force: true
                })

            } else if (cases.Identification == 'Haj') {

                cy.get(".form-check-input").eq(16).click({
                    force: true
                })

            }

        })








        // cy.get('.choices > div.form-control').eq(8).click().then(() => {
        //     cy.get('#choices--reportingDistrict-item-choice-3').click({ force: true })
        // })

        // cy.get('.choices > div.form-control').eq(9).click().then(() => {
        //     cy.get('#choices--city-item-choice-1').click({ force: true })
        // })

        // cy.get('#requesterMobileNumber').type('00000005')

        // cy.get('#map-search').type('المدينه المنوره')

        // cy.get('[style="position: absolute; left: 0px; top: 0px; z-index: 106; width: 100%;"] > div > img').click({ force: true })

        // cy.get(".form-check-input").eq(18).click()

        // cy.get(".form-check-input").eq(19).click()

        // cy.get('#notes').type('molahazat')

        //cy.get('#submit').click()
    })
})