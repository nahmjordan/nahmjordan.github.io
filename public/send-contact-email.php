<?php
    if(isset($_POST['email'])) {

        $emailTo = "jnahm@edu.uwaterloo.ca";
        $emailSubject = "Contact Form Submission";

        function died($error) {
            echo "Lol, it looks like your submission is fraught with error! ";
            echo "These errors appear below.<br /><br />";
            echo $error."<br /><br />";
            echo "Please go back and fix these errors.<br /><br />";
            die();
        }

        if(!isset($_POST['body'])) {
            died('*Nice message doofus*');
        }

        $emailFrom = $_POST['email'];
        $body = $_POST['body'];

        $errorMsg = "";
        $emailExp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

        if(!preg_match($emailExp, $emailFrom)) {
            $error_message .= 'You missed a spot on that email pal.';
        }

        function clean_string($string) {
            $bad = array("content-type","bcc:","to:","cc:","href");
            return str_replace($bad,"",$string);
        }

        $headers = 'From: '.$email_from."\r\n".
        'Reply-To: '.$email_from."\r\n" .
        'X-Mailer: PHP/' . phpversion();
        @mail($emailTo, $emailSubject, $body, $headers);  
        ?>
            Thanks for the message ^~^
        <?php

    }
?>