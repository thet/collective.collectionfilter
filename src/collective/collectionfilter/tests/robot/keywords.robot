
*** Settings *****************************************************************

Resource  plone/app/robotframework/selenium.robot
Resource  plone/app/robotframework/keywords.robot


*** Variables ***

${BROWSER}  chrome


*** Keywords *****************************************************************


# --- Given ------------------------------------------------------------------

a login form
  Go To  ${PLONE_URL}/login_form
  Wait until page contains  Login Name
  Wait until page contains  Password

a logged-in manager
    Enable autologin as  Manager
    Set autologin username  Manager


# --- WHEN -------------------------------------------------------------------

I enter valid credentials
  Input Text  __ac_name  admin
  Input Text  __ac_password  secret
  Click Button  Log in


# --- THEN -------------------------------------------------------------------

I am logged in
  Wait until page contains  You are now logged in
  Page should contain  You are now logged in


# --- MISC

Click Input "${label}"
    Click Element  xpath=//input[@id=//label[.//*[text()='${label}'] or text()='${label}']/@for]

Manage Portlets
    Click link  link:Manage portlets
    Element should be visible  css=#plone-contentmenu-portletmanager > ul
    Click link  link:Right column


Select related filter collection
    Click element  css=div.pattern-relateditems-container input.select2-input
    Wait until page contains element  xpath://ul[@class='select2-results']//a[@data-path='/']
    Click link  xpath://ul[@class='select2-results']//a[@data-path='/']
    Wait until page contains element  xpath://ul[@class='select2-results']//a[@data-path='/testcollection']
    Click link  xpath://ul[@class='select2-results']//a[@data-path='/testcollection']

Add search portlet
    Wait until page contains element  css=select.add-portlet
    Select From List by label  css=select.add-portlet  Collection Search
    Wait until element is visible  css=input#form-widgets-header

    Input text  css=input#form-widgets-header  Searchable Text
    Select related filter collection
    Click element  css=.plone-modal-footer input#form-buttons-add
    Wait until page contains element  xpath://div[@class='portletAssignments']//a[text()='Searchable Text']

Add filter portlet
    [Arguments]   ${group_criteria}  ${filter_type}  ${input_type}

    Wait until page contains element  css=select.add-portlet
    Select From List by label  css=select.add-portlet  Collection Filter
    Wait until element is visible  css=input#form-widgets-header

    Input text  css=input#form-widgets-header  ${group_criteria}
    Select related filter collection
    Select from List by value  css=select#form-widgets-group_by  ${group_criteria}
    Click Input "Show count"
    Select from List by value  css=select#form-widgets-filter_type  ${filter_type}
    Select from List by value  css=select#form-widgets-input_type  ${input_type}
    Click element  css=.plone-modal-footer input#form-buttons-add
    Wait until page contains element  xpath://div[contains(@class, 'portletAssignments')]//a[text()='${group_criteria}']


Should be ${X} filter checkboxes
    Wait until keyword succeeds  5s  1s  Page Should Contain Element  xpath=//div[contains(@class, 'filterContent')]//li[contains(@class, 'filterItem')]  limit=${X}

Should be ${X} collection results
    Wait until keyword succeeds  5s  1s  Page Should Contain Element  xpath=//article[@class='entry']  limit=${X}

Should be ${X} pages
    ${X}=  evaluate  ${X} + 1  # need we have next or previous
    Wait until keyword succeeds  5s  1s  Page Should Contain Element  xpath=//nav[@class='pagination']//a  limit=${X}

Set Batch Size
    [Arguments]   ${batch_size}

    Go to  ${PLONE_URL}/testcollection/edit
    Input text  css=input#form-widgets-ICollection-item_count  ${batch_size}
    Click element  css=input#form-buttons-save
    Go to  ${PLONE_URL}/testcollection

Set Hide "${title}"
    Click Link  ${title}
    Click Input "Hide if empty"
    Click element  css=.plone-modal-footer input#form-buttons-apply
    #click element  xpath=//*[contains(@value,'Save')]
    Wait until page contains element  xpath://div[contains(@class, 'portletAssignments')]//a[text()='${title}']
    Go to  ${PLONE_URL}/testcollection
