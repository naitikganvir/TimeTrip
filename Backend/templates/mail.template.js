let emailTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{{title}}</title>
  </head>
  <body
    style="background-color: #ffffff; color: #333; margin: 0px; padding: 0px"
  >
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
      "
    >
      <div style="display: flex; margin-bottom: 30px; gap: 20px">
        <img
         
          alt="TimeTrip"
          style="margin: 0px auto; height: 60px"
        />
      </div>

      <h2 style="margin-top: 0">{{title}}</h2>
      <p>Hi {{name}},</p>

      <p style="text-wrap: pretty;">{{message}}</p>
      <div style="display: flex; width: 100%">
        <a
          href="{{cta_link}}"
          target="_blank"
          style="
            display: inline-block;
            text-align: center;
            margin: 10px auto;
            padding: 18px 36px;
            background-color: #51d56b;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            border-radius: 6px;
            color: #ffffff;
          "
        >
          {{cta_text}}
        </a>
      </div>
      <p style="text-wrap: pretty;">{{note}}</p>

      <div
        style="
          font-size: 13px;
          color: #777;
          margin-top: 30px;
          text-align: center;
        "
      >
        &mdash; The TimeTrip Team
        <br />
        <small>
          If you have any questions or need help, feel free to reach out to our
          team at
          <a href="mailto:${process.env.MAIL_USER}" style="color: #4caf50"
            >${process.env.MAIL_USER}</a
          >
        </small>
      </div>
    </div>
  </body>
</html>

`;
const fillTemplate = (data, template = emailTemplate) => {
  return template
    .replace(/{{title}}/g, data.title || "")
    .replace(/{{name}}/g, data.name || "there")
    .replace(/{{message}}/g, data.message || "")
    .replace(/{{cta_link}}/g, data.cta_link || "")
    .replace(/{{cta_text}}/g, data.cta_text || "Click Here")
    .replace(/{{note}}/g, data.note || "");
};

module.exports = { emailTemplate, fillTemplate };
