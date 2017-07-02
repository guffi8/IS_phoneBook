
$(document).ready(function() {

    $( "#add_btn" ).click(add);
    $( "#add-record" ).submit(submit);
    $( "#edit-record" ).submit(edit_submit);
    $( "#search" ).keypress(search);
    $( "#search" ).keydown(search);
    $( "#search" ).keyup(search);
    setPhoneBook();

});

function search(){
    var searchVal = $('#search').val();
    console.log('search for :', searchVal);
    $.ajax({
        url: '/search',
        data: { value : searchVal},
        success: function (data){
            console.log( data   ,'search');
            buildPhoneBook(data);
        }
    });
}

function buildPhoneBook(data){

    var phoneBook =  document.getElementById('phoneBookList');
    var phoneBookHtml = '';

    if(data.length < 1)
        phoneBookHtml = ('No Contacts found');
    else {
        phoneBookHtml = '<table class="phoneBook"><tr><th>Name</th><th>Phone</th><th></th><th></th></tr>';
        var i = 0;
        for(i; i < data.length; i++){
            var record = data[i];
            console.log('record [' + i +']' , record);
            class_type = (i % 2 == 0) ? 'odd_row' : 'even_row';
            phoneBookHtml += '<tr class="' + class_type +'"><td>'+ record.name + '</td><td>' + record.phone + '</td>';
            phoneBookHtml += '<td><button class"'+record.token+'"  onclick="edit(\''+record.token+'\')">Edit</button></td>';
            phoneBookHtml += '<td><button class="'+record.token+'" onclick="del(\''+record.token+'\')">Delete</button></td>';
            phoneBookHtml += '</tr>';
        }
        phoneBookHtml += '</table>';
    }
    phoneBook.innerHTML = phoneBookHtml;

}


function setPhoneBook(){
    $.ajax({
        url: '/getAll',
        data: null,
        success: function (data){
            console.log( data   ,'getAll::data');
            buildPhoneBook(data);
        }
    });


}
function add(){
    console.log('eric add btn');
    changeDiv('phoneBook', 'add');
}

function del(token){

    var result = confirm("Are you sure that you want to delete?");
    if (result) {
        $.ajax({
            url: '/delete',
            data: {t : token},
            success: function (data){
                setPhoneBook();
            }
        });
    }

}

function edit(token){
    $.ajax({
        url: '/getByToken',
        data: {t : token},
        success: function (data){
            console.log( data ,'getByToken::data');
            $('#edit-name').val(data.name);
            $('#edit-phone').val(data.phone);
            $('#edit-record').addClass(token);
            changeDiv('phoneBook', 'edit');
        }
    });
}



function submit(){

    var name = $('#name').val();
    var phone =  $('#phone').val();

        $.ajax({
            url: '/add',
            data: {'name': name, 'number': phone},
            success: function (data){
                setPhoneBook();
                changeDiv('add','phoneBook');
            }
        });

}
function edit_submit(){

    var name = $('#edit-name').val();
    var phone =  $('#edit-phone').val();
    $.ajax({
        url: '/edit',
        data: {'name': name, 'phone': phone, 'token' : this.className},
        success: function (data){
            setPhoneBook();
            changeDiv('edit','phoneBook');
        }
    });

}



function changeDiv(divToHide, divToOpen){
    $('#' + divToHide).hide();
    $('#' + divToOpen).fadeIn();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}