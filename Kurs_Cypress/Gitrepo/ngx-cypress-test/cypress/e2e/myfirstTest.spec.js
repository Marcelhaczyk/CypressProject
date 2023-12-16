/// <reference types="cypress" />

const { Dropdown } = require("bootstrap")

describe('Our first set', () => {
    
    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()



        //find by Tag name
        cy.get('input')

        //by ID (add # at the beginning)
        cy.get('#inputEmail1')

        //by Class name (add . at the beginning) only first value
        cy.get('.input-full-width')


        //by Atributte name (add [] at the beginning)
        cy.get('[placeholder]')

        //by Attribute name and value (add [] at the beginning)
        cy.get('[placeholder="Email"]')

        //by Class value (add [] at the beginning)
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by Tag name and Attribute with value
        cy.get('input[placeholder="Email"]')

        //by two or more different Attributes (or Attribute with values)
        cy.get('[placeholder="Email"][fullwidth][type="email"]')

        //by tag name, Attribute with value, ID and Class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //The most recommended way by Cypress (Attribute created by ourslves and added to the source code)
        cy.get('[data-cy="imputEmail1"]')


    })

// Another test
    it('second test', () => {  // it.only means we want to run only this one test

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="SignInButton"]')

        cy.contains('Sign in')
        cy.contains('[status="warning"]','Sign in')

        cy.get('#inputEmail3') //cy.get is searching elemets in the entire DOM 
        .parents('form')
        .find('button')  // find method is only to find the child elements inside of parents element
        .should('contain', 'Sign in')
        .parents('form')
        .find('nb-checkbox')
        .click()

        cy.contains('nb-card', 'Horizontal form').find('[type="email"]') // we find nb-card tag which contains Horizontal form text and find attribute with value email. cy.contains will find only one element in the web page!
    })


// Another test
    it('then and wrap methods tests', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain','Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain','Password')
        cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain','Email address')
        cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain','Password')


        // in selenium instead of repeating the same lines we could use sth like this:
        // const firstForm =  cy.contains('nb-card', 'Using the Grid')
        // const secondForm =  cy.contains('nb-card', 'Basic Form')

        // firstForm.find('[for="inputEmail1"]').should('contain','Email')
        // firstForm.find('[for="inputPassword2"]').should('contain','Password')

        // secondForm.find('[for="exampleInputPassword1"]').should('contain','Password')
        // secondForm.find.find('[for="exampleInputEmail1"]').should('contain','Email address')


        // In Cypress, we use it like this: (JQuery format)
        cy.contains('nb-card', 'Using the Grid').then(firstForm => {
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabelFirst).to.be.equal('Email')
            expect(passwordLabelFirst).to.be.equal('Password')

            cy.contains('nb-card', 'Basic form').then(secondForm => {
                const emailLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordLabelFirst).to.equal(emailLabelSecond)

                // if we want to continue in the basic format (cypress format) as at the beggiing we can use our method:
                cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain','Password')
                // or when we want to use our pre defined parametes: (recommended) (bardziej czytelne w tej wersji skoro dzialamy na stalych zmiennych itp)
                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            }) 

        })

    })
    it('invoke command', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        // 1 sposob
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2 sposob - nasza nazwa 'label' to JQuery lement
        cy.get('[for="exampleInputEmail1"]').then( label => {
            expect(label.text()).to.equal('Email address')
        })


        // 3 sposob
        cy.get('[for="exampleInputEmail1"]').invoke('text').then( my_text => {
            expect(my_text).to.equal('Email address')
        })

        cy.contains('nb-card', 'Basic form')
        .find('nb-checkbox')
        .click()
        .find('.custom-checkbox')
        .invoke('attr', 'class') // to znaczy żeby odwołał się do attribute which has name class
        .should('contain', 'checked')


    })


    it('Assert property', () => {

            function selectDayFromCurrent(day){
                let today_date = new Date()
                today_date.setDate(today_date.getDate() + day)
                let futureDay = today_date.getDate()
                let futureMonth = today_date.toLocaleString('en-US', {month:'short'})
                let dateAssert = futureMonth+' '+futureDay+', '+ today_date.getFullYear()
                cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then (dateAttribute => {
                    if(!dateAttribute.includes(futureMonth)){
                        cy.get('[data-name="chevron-right"]').click()
                        selectDayFromCurrent(day)
                    } else {
                        cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
                    }
                })
            return dateAssert
            }
            cy.visit('/')
            cy.contains('Forms').click()
            cy.contains('Datepicker').click()
    
        
            cy.contains('nb-card', 'Common Datepicker').find('input').then(  input => {
                cy.wrap(input).click()
                let dateAssert = selectDayFromCurrent(101)

            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })
    })


    it('radio button', () => { // radio buttons to inny rodzaj checkbox'a
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
            cy.wrap(radioButtons)
                .first() // .first() or .eq(0) is to get the first element
                .check({force: true}) // check uzywamy do radio buttons i do checkbox
                .should('be.checked')


            cy.wrap(radioButtons) // next button 
                .eq(1) // element with index 1 
                .check({force: true}) 

            cy.wrap(radioButtons)
                .first()
                .should('not.be.checked')

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')
        })
    })

    it('check boxes', () => {
            cy.visit('/')
            cy.contains('Modal & Overlays').click()
            cy.contains('Toastr').click()
    
            //cy.get('[type="checkbox"]').check({force:true}) // check all found checkboxes
            //cy.get('[type="checkbox"]').eq(0).click({force:true}) // for check or uncheck selected checkbox
            cy.get('[type="checkbox"]').eq(0).check({force:true}) // this (as the name suggest) only check the box, it will not uncheck the box if it is clicked

        })

    it('check boxes', () => {
            cy.visit('/')

            //1 opcja gdzie sprawdzamy dla wybranego motywu(Dark,Light,Cosmic,Corporate) strony
            // cy.get('button[ng-reflect-klass="select-button"]').click() //lub tak można cy.get('nav nb-select').click() 
            // cy.get('nb-option[ng-reflect-value="dark"]').click()  //lub cy.get('.options-list').contains('Dark').click()
            // cy.get('nav nb-select').should('contain', 'Dark')
            // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)') // w Devtools mamy tą informację w zakładce 'Styles'
         
            //2 opcja lepsza (pętla), gdzie sprawdzamy automatycznie zależnie od wyboru użytkownika
            cy.get('button[ng-reflect-klass="select-button"]').then( dropdown => {
                cy.wrap(dropdown).click()
                cy.get('nb-option').each( (listItem, index) => {
                    const itemText = listItem.text().trim() //trim delete the space which is in devtools " Light"


                    const colors = {
                        "Light": "rgb(255, 255, 255)",
                        "Dark": "rgb(34, 43, 69)",
                        "Cosmic":"rgb(50, 50, 89)",
                        "Corporate": "rgb(255, 255, 255)"
                    }

                    cy.wrap(listItem).click()
                    cy.wrap(dropdown).should('contain', itemText)
                    cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
                    if (index<3){
                        cy.wrap(dropdown).click()
                    }
                })
            })

 
        })



        it('check boxes', () => {
             cy.visit('/')
             cy.contains('Tables & Data').click()
             cy.contains('Smart Table').click()

             cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
                cy.wrap(tableRow).find('.nb-edit').click()
                cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
                cy.wrap(tableRow).find('.nb-checkmark').click()
                cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
             })

              cy.get('.id="header-login-button"-').
              // lub cy.get('thead').find('nb-plus').click()
            //  cy.get('[ng-reflect-name="firstName"]').type('Marcel')
            //  cy.get('[ng-reflect-name="lastName"]').type('Haczyk')
            //  cy.get('.nb-checkmark').click()
            //  cy.get('tbody').contains('tr', 'Haczyk').should('exist');


             // Lub 2 sposobem'
             cy.gte('id="header-login-button"').find('tr').eq(2).then( table_row => {
                cy.wrap(table_row).find('[ng-reflect-name="firstName"]').type('Marcel')
                cy.wrap(table_row).find('[ng-reflect-name="lastName"]').type('Haczyk')
                cy.wrap(table_row).find('.nb-checkmark').click()
             })

             // Sprawdzenie czy nasze komorki zawierają wpisane dane
             cy.get('tbody tr').first().find('td').then( all_table_columns => { // we created a variable all_table_columns which contains all variables from the first row
                cy.wrap(all_table_columns).eq(2).should('contain', 'Marcel')
                cy.wrap(all_table_columns).eq(3).should('contain', 'Haczyk')
             })

            // check in loop if we have correct results in each loop 

              const age = [20, 30, 40, 200]

              cy.wrap(age).each(age => {
                cy.get('thead [placeholder="Age"]').clear().type(age)
                cy.wait(500)
                cy.get('tbody tr').each( table_row => {
                    if (age == 200){
                        cy.wrap(table_row).should('contain', 'No data found') // rowne 6 oznacze 6th kolumnę (ostatnia)
                    }
                    else{                   
                         cy.wrap(table_row).find('td').eq(6).should('contain', age) // rowne 6 oznacze 6th kolumnę (ostatnia)
                        }
                  })

              })

              




        })

        // PopUps and ToolTips

        it('tooltip', () => { 
            cy.visit('/')
            cy.contains('Modal & Overlays').click()
            cy.contains('Tooltip').click()

            cy.contains('nb-card', 'Colored Tooltips')
                .contains('Default').click()

            cy.get('nb-tooltip').should('contain', 'This is a tooltip')
        })

        // PopUps and ToolTips

        it.only('dialog box', () => {
            cy.visit('/')
            cy.contains('Tables & Data').click()
            cy.contains('Smart Table').click()

            // nie polecany sposób, bo jezeli okno sie nie pojawi to test i tak przejdzie a powinien być failed
            // cy.get('tbody tr').first().find('.nb-trash').click()
            // cy.on('window:confirm', (confirm) => {
            //     expect(confirm).to.equal('Are you sure you want to delete?')
            // })

        // polecany sposob
            // const stub = cy.stub()
            // cy.on('window:confirm', stub)
            // cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
            //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
            // })

            // Jezeli w okienku pop up chcemy kliknąć false:
            cy.get('tbody tr').first().find('.nb-trash')
            cy.on('window:confirm', () => false)



        })


})