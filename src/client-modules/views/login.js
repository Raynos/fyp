var loginHTML = "<div class='login'>" +
        "<input name='email' placeholder='email' />" +
        "<input name='password' placeholder='password' />" +
        "<button name='submit'>Login</button>" +
    "</div>"

module.exports = {
    renderInitial: function () {
        var frag = this.util.Fragment(loginHTML),
            elem = frag.firstChild

        document.body.appendChild(frag)
        return elem
    }
}