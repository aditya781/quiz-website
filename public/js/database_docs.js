
//database name=quiz_app


/*
create table admin_table(
    admin_name varchar(100) not null,
    admin_email varchar(100) not null,
    admin_pass varchar(100 ) not null,
    admin_phone bigint not null,
    admin_profession varchar(100),
    primary key(admin_email)
);

create table questions_table(
    que_id int not null AUTO_INCREMENT,
    question varchar(1000) not null,
    a varchar(200),
    b varchar(200),
    c varchar(200),
    d varchar(200),
    answer varchar(200),
    admin_email varchar(100) not null,
    primary key(que_id),
    foreign key (admin_email) references admin_table(admin_email)
);

create table subject_table(
    subject_name varchar(100) not null,
    que_id int not null,
    foreign key (que_id) references questions_table(que_id)
);

*/

