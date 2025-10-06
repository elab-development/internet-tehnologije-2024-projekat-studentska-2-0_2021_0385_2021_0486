<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Potvrda o statusu studenta</title>
    <style>
        @page { margin: 40px; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
        }
        .header, .footer {
            text-align: center;
        }
        .header h3, .header h4 {
            margin: 0;
        }
        .content {
            margin-top: 50px;
            margin-bottom: 50px;
            line-height: 1.6;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-top: 40px;
            margin-bottom: 30px;
        }
        .signatures {
            margin-top: 60px;
            width: 100%;
        }
        .signatures td {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }
        .signature-line {
            border-top: 1px solid black;
            width: 200px;
            margin: 0 auto 5px auto;
        }
       .signature-text {
            font-family: 'Dancing Script'; 
            font-size: 20px;
            color: #0000FF;
            position: relative;
            top: 20px;
            left: -10px;
        }
       
        .seal-image {
            width: 150px;
            height: 150px;
            margin-bottom: -15px; 
        }
    </style>
</head>
<body>

    <div class="header">
        <h3>UNIVERZITET U BEOGRADU</h3>
        <h4>FAKULTET ORGANIZACIONIH NAUKA</h4>
        <p>Jove Ilića 154, 11000 Beograd</p>
    </div>

    <div class="title">
        P O T V R D A <br>
        O STATUSU STUDENTA
    </div>

    <div class="content">
        <p>
            Potvrđuje se da je student/studentkinja <strong>{{ $student->ime }} {{ $student->prezime }}</strong>,
            sa brojem indeksa <strong>{{ $student->broj_indeksa }}</strong>,
            rođen/a dana {{ \Carbon\Carbon::parse($student->datum_rodjenja)->format('d.m.Y.') }},
            upisan/a na Fakultet organizacionih nauka u statusu studenta: <strong>{{ ucfirst($student->status) }}</strong>.
        </p>
        <p>
            Potvrda se izdaje na lični zahtev radi regulisanja prava koja studentu pripadaju po osnovu
            njegovog statusa i u druge svrhe se ne može koristiti.
        </p>
    </div>

    <p>U Beogradu, {{ $datum }}</p>

    <table class="signatures">
        <tr>
            <td>
                <img src="{{ public_path('images/seal.png') }}" class="seal-image">
                <p>M.P.</p>
            </td>
            <td>
                <p class="signature-text">Marko Markovic</p>

                <div class="signature-line"></div>
                <p>(potpis ovlašćenog lica)</p>
                <p>Šef studentske službe</p>
            </td>
        </tr>
    </table>

</body>
</html>