import AccountPage from './Volunteer'
import AccountPage1 from './Student'
import AccountPage2 from './Admin'
import enhance from './AccountPage.enhancer'

export default enhance(AccountPage, AccountPage1, AccountPage2)
