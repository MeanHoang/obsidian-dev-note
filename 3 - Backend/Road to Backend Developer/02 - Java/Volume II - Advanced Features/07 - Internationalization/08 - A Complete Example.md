# 08 — A Complete Example

> Chapter 7, Section 7.8 — Core Java Volume II: Advanced Features, 11th Edition (Horstmann), Java 11.
> Trích nguyên văn + dịch. Không thêm diễn giải ngoài sách.

---

## 7.8. A Complete Example

> *"In this section, we apply the material of this chapter to localize a retirement calculator. The program calculates whether or not you are saving enough money for your retirement. You enter your age, how much money you save every month, and so on."*

**Dịch:** Trong phần này ta áp dụng nội dung của chương để **localize một máy tính hưu trí**. Chương trình tính xem bạn có **tiết kiệm đủ tiền cho lúc nghỉ hưu** hay không. Bạn nhập tuổi, số tiền tiết kiệm mỗi tháng, v.v.

> *"The text area and the graph show the balance of the retirement account for every year. If the numbers turn negative toward the later part of your life and the bars in the graph appear below the x axis, you need to do something—for example, save more money, postpone your retirement, die earlier, or be younger."*

**Dịch:** Text area và đồ thị hiển thị **số dư tài khoản hưu trí theo từng năm**. Nếu các con số **chuyển thành âm** về cuối đời và các cột trong đồ thị **nằm dưới trục x**, bạn cần làm gì đó — ví dụ tiết kiệm nhiều hơn, hoãn nghỉ hưu, chết sớm hơn, hoặc trẻ lại.

### Các điểm nổi bật về internationalization

> *"The retirement calculator works in three locales (English, German, and Chinese). Here are some of the highlights of the internationalization:"*
> - *"The labels, buttons, and messages are translated into German and Chinese. You can find them in the classes RetireResources_de and RetireResources_zh. English is used as the fallback—see the RetireResources file."*
> - *"Whenever the locale changes, we reset the labels and reformat the contents of the text fields."*
> - *"The text fields handle numbers, currency amounts, and percentages in the local format."*
> - *"The computation field uses a MessageFormat. The format string is stored in the resource bundle of each language."*
> - *"Just to show that it can be done, we use different colors for the bar graph, depending on the language chosen by the user."*

**Dịch:** Máy tính hưu trí hoạt động ở **ba locale (Anh, Đức, Trung)**. Các điểm nổi bật:

- Nhãn, button, message được **dịch sang tiếng Đức và tiếng Trung**, nằm trong class `RetireResources_de` và `RetireResources_zh`. **Tiếng Anh dùng làm fallback** — xem file `RetireResources`.
- Mỗi khi **locale thay đổi**, ta **đặt lại nhãn và format lại nội dung** của các text field.
- Text field xử lý số, số tiền, phần trăm **theo format bản địa**.
- Ô tính toán dùng **`MessageFormat`**. Format string được lưu trong **resource bundle của từng ngôn ngữ**.
- Chỉ để cho thấy là làm được, ta dùng **màu khác nhau cho đồ thị cột**, tùy ngôn ngữ người dùng chọn.

> *"Listings 7.5 through 7.8 show the code. Listings 7.9 through 7.11 are the property files for the localized strings. Figures 7.5 and 7.6 show the outputs in German and Chinese, respectively. To see Chinese characters, be sure you have Chinese fonts installed and configured with your Java runtime. Otherwise, Chinese characters will show up as "missing character" icons."*

**Dịch:** Để thấy được chữ Hán, hãy chắc chắn bạn đã **cài và cấu hình font tiếng Trung** với Java runtime. Nếu không, chữ Hán sẽ hiện ra thành icon **"missing character"**.

---

### Listing 7.5 — `retire/Retire.java`

```java
package retire;

import java.awt.*;
import java.awt.geom.*;
import java.text.*;
import java.util.*;

import javax.swing.*;

/**
 * This program shows a retirement calculator. The UI is displayed in English, German, and
 * Chinese.
 * @version 1.25 2018-05-01
 * @author Cay Horstmann
 */
public class Retire
{
   public static void main(String[] args)
   {
      EventQueue.invokeLater(() ->
         {
            var frame = new RetireFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
         });
   }
}

class RetireFrame extends JFrame
{
   private JTextField savingsField = new JTextField(10);
   private JTextField contribField = new JTextField(10);
   private JTextField incomeField = new JTextField(10);
   private JTextField currentAgeField = new JTextField(4);
   private JTextField retireAgeField = new JTextField(4);
   private JTextField deathAgeField = new JTextField(4);
   private JTextField inflationPercentField = new JTextField(6);
   private JTextField investPercentField = new JTextField(6);
   private JTextArea retireText = new JTextArea(10, 25);
   private RetireComponent retireCanvas = new RetireComponent();
   private JButton computeButton = new JButton();
   private JLabel languageLabel = new JLabel();
   private JLabel savingsLabel = new JLabel();
   private JLabel contribLabel = new JLabel();
   private JLabel incomeLabel = new JLabel();
   private JLabel currentAgeLabel = new JLabel();
   private JLabel retireAgeLabel = new JLabel();
   private JLabel deathAgeLabel = new JLabel();
   private JLabel inflationPercentLabel = new JLabel();
   private JLabel investPercentLabel = new JLabel();
   private RetireInfo info = new RetireInfo();
   private Locale[] locales = { Locale.US, Locale.CHINA, Locale.GERMANY };
   private Locale currentLocale;
   private JComboBox<Locale> localeCombo = new LocaleCombo(locales);
   private ResourceBundle res;
   private ResourceBundle resStrings;
   private NumberFormat currencyFmt;
   private NumberFormat numberFmt;
   private NumberFormat percentFmt;

   public RetireFrame()
   {
      setLayout(new GridBagLayout());
      add(languageLabel, new GBC(0, 0).setAnchor(GBC.EAST));
      add(savingsLabel, new GBC(0, 1).setAnchor(GBC.EAST));
      add(contribLabel, new GBC(2, 1).setAnchor(GBC.EAST));
      add(incomeLabel, new GBC(4, 1).setAnchor(GBC.EAST));
      add(currentAgeLabel, new GBC(0, 2).setAnchor(GBC.EAST));
      add(retireAgeLabel, new GBC(2, 2).setAnchor(GBC.EAST));
      add(deathAgeLabel, new GBC(4, 2).setAnchor(GBC.EAST));
      add(inflationPercentLabel, new GBC(0, 3).setAnchor(GBC.EAST));
      add(investPercentLabel, new GBC(2, 3).setAnchor(GBC.EAST));
      add(localeCombo, new GBC(1, 0, 3, 1));
      add(savingsField, new GBC(1, 1).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(contribField, new GBC(3, 1).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(incomeField, new GBC(5, 1).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(currentAgeField, new GBC(1, 2).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(retireAgeField, new GBC(3, 2).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(deathAgeField, new GBC(5, 2).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(inflationPercentField, new GBC(1, 3).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(investPercentField, new GBC(3, 3).setWeight(100, 0).setFill(GBC.HORIZONTAL));
      add(retireCanvas, new GBC(0, 4, 4, 1).setWeight(100, 100).setFill(GBC.BOTH));
      add(new JScrollPane(retireText),
         new GBC(4, 4, 2, 1).setWeight(0, 100).setFill(GBC.BOTH));

      computeButton.setName("computeButton");
      computeButton.addActionListener(event ->
         {
            getInfo();
            updateData();
            updateGraph();
         });
      add(computeButton, new GBC(5, 3));

      retireText.setEditable(false);
      retireText.setFont(new Font("Monospaced", Font.PLAIN, 10));

      info.setSavings(0);
      info.setContrib(9000);
      info.setIncome(60000);
      info.setCurrentAge(35);
      info.setRetireAge(65);
      info.setDeathAge(85);
      info.setInvestPercent(0.1);
      info.setInflationPercent(0.05);

      int localeIndex = 0; // US locale is default selection
      for (int i = 0; i < locales.length; i++)
         // if current locale one of the choices, select it
         if (getLocale().equals(locales[i])) localeIndex = i;
      setCurrentLocale(locales[localeIndex]);

      localeCombo.addActionListener(event ->
         {
            setCurrentLocale((Locale) localeCombo.getSelectedItem());
            validate();
         });
      pack();
   }

   /**
    * Sets the current locale.
    * @param locale the desired locale
    */
   public void setCurrentLocale(Locale locale)
   {
      currentLocale = locale;
      localeCombo.setLocale(currentLocale);
      localeCombo.setSelectedItem(currentLocale);

      res = ResourceBundle.getBundle("retire.RetireResources", currentLocale);
      resStrings = ResourceBundle.getBundle("retire.RetireStrings", currentLocale);
      currencyFmt = NumberFormat.getCurrencyInstance(currentLocale);
      numberFmt = NumberFormat.getNumberInstance(currentLocale);
      percentFmt = NumberFormat.getPercentInstance(currentLocale);

      updateDisplay();
      updateInfo();
      updateData();
      updateGraph();
   }

   /**
    * Updates all labels in the display.
    */
   public void updateDisplay()
   {
      languageLabel.setText(resStrings.getString("language"));
      savingsLabel.setText(resStrings.getString("savings"));
      contribLabel.setText(resStrings.getString("contrib"));
      incomeLabel.setText(resStrings.getString("income"));
      currentAgeLabel.setText(resStrings.getString("currentAge"));
      retireAgeLabel.setText(resStrings.getString("retireAge"));
      deathAgeLabel.setText(resStrings.getString("deathAge"));
      inflationPercentLabel.setText(resStrings.getString("inflationPercent"));
      investPercentLabel.setText(resStrings.getString("investPercent"));
      computeButton.setText(resStrings.getString("computeButton"));
   }

   /**
    * Updates the information in the text fields.
    */
   public void updateInfo()
   {
      savingsField.setText(currencyFmt.format(info.getSavings()));
      contribField.setText(currencyFmt.format(info.getContrib()));
      incomeField.setText(currencyFmt.format(info.getIncome()));
      currentAgeField.setText(numberFmt.format(info.getCurrentAge()));
      retireAgeField.setText(numberFmt.format(info.getRetireAge()));
      deathAgeField.setText(numberFmt.format(info.getDeathAge()));
      investPercentField.setText(percentFmt.format(info.getInvestPercent()));
      inflationPercentField.setText(percentFmt.format(info.getInflationPercent()));
   }

   /**
    * Updates the data displayed in the text area.
    */
   public void updateData()
   {
      retireText.setText("");
      var retireMsg = new MessageFormat("");
      retireMsg.setLocale(currentLocale);
      retireMsg.applyPattern(resStrings.getString("retire"));

      for (int i = info.getCurrentAge(); i <= info.getDeathAge(); i++)
      {
         Object[] args = { i, info.getBalance(i) };
         retireText.append(retireMsg.format(args) + "\n");
      }
   }

   /**
    * Updates the graph.
    */
   public void updateGraph()
   {
      retireCanvas.setColorPre((Color) res.getObject("colorPre"));
      retireCanvas.setColorGain((Color) res.getObject("colorGain"));
      retireCanvas.setColorLoss((Color) res.getObject("colorLoss"));
      retireCanvas.setInfo(info);
      repaint();
   }

   /**
    * Reads the user input from the text fields.
    */
   public void getInfo()
   {
      try
      {
         info.setSavings(currencyFmt.parse(savingsField.getText()).doubleValue());
         info.setContrib(currencyFmt.parse(contribField.getText()).doubleValue());
         info.setIncome(currencyFmt.parse(incomeField.getText()).doubleValue());
         info.setCurrentAge(numberFmt.parse(currentAgeField.getText()).intValue());
         info.setRetireAge(numberFmt.parse(retireAgeField.getText()).intValue());
         info.setDeathAge(numberFmt.parse(deathAgeField.getText()).intValue());
         info.setInvestPercent(percentFmt.parse(investPercentField.getText()).doubleValue());
         info.setInflationPercent(
            percentFmt.parse(inflationPercentField.getText()).doubleValue());
      }
      catch (ParseException ex)
      {
         ex.printStackTrace();
      }
   }
}

/**
 * The information required to compute retirement income data.
 */
class RetireInfo
{
   private double savings;
   private double contrib;
   private double income;
   private int currentAge;
   private int retireAge;
   private int deathAge;
   private double inflationPercent;
   private double investPercent;
   private int age;
   private double balance;

   /**
    * Gets the available balance for a given year.
    * @param year the year for which to compute the balance
    * @return the amount of money available (or required) in that year
    */
   public double getBalance(int year)
   {
      if (year < currentAge) return 0;
      else if (year == currentAge)
      {
         age = year;
         balance = savings;
         return balance;
      }
      else if (year == age) return balance;
      if (year != age + 1) getBalance(year - 1);
      age = year;
      if (age < retireAge) balance += contrib;
      else balance -= income;
      balance = balance * (1 + (investPercent - inflationPercent));
      return balance;
   }

   /**
    * Gets the amount of prior savings.
    * @return the savings amount
    */
   public double getSavings()
   {
      return savings;
   }

   /**
    * Sets the amount of prior savings.
    * @param newValue the savings amount
    */
   public void setSavings(double newValue)
   {
      savings = newValue;
   }

   /**
    * Gets the annual contribution to the retirement account.
    * @return the contribution amount
    */
   public double getContrib()
   {
      return contrib;
   }

   /**
    * Sets the annual contribution to the retirement account.
    * @param newValue the contribution amount
    */
   public void setContrib(double newValue)
   {
      contrib = newValue;
   }

   /**
    * Gets the annual income.
    * @return the income amount
    */
   public double getIncome()
   {
      return income;
   }

   /**
    * Sets the annual income.
    * @param newValue the income amount
    */
   public void setIncome(double newValue)
   {
      income = newValue;
   }

   /**
    * Gets the current age.
    * @return the age
    */
   public int getCurrentAge()
   {
      return currentAge;
   }

   /**
    * Sets the current age.
    * @param newValue the age
    */
   public void setCurrentAge(int newValue)
   {
      currentAge = newValue;
   }

   /**
    * Gets the desired retirement age.
    * @return the age
    */
   public int getRetireAge()
   {
      return retireAge;
   }

   /**
    * Sets the desired retirement age.
    * @param newValue the age
    */
   public void setRetireAge(int newValue)
   {
      retireAge = newValue;
   }

   /**
    * Gets the expected age of death.
    * @return the age
    */
   public int getDeathAge()
   {
      return deathAge;
   }

   /**
    * Sets the expected age of death.
    * @param newValue the age
    */
   public void setDeathAge(int newValue)
   {
      deathAge = newValue;
   }

   /**
    * Gets the estimated percentage of inflation.
    * @return the percentage
    */
   public double getInflationPercent()
   {
      return inflationPercent;
   }

   /**
    * Sets the estimated percentage of inflation.
    * @param newValue the percentage
    */
   public void setInflationPercent(double newValue)
   {
      inflationPercent = newValue;
   }

   /**
    * Gets the estimated yield of the investment.
    * @return the percentage
    */
   public double getInvestPercent()
   {
      return investPercent;
   }

   /**
    * Sets the estimated yield of the investment.
    * @param newValue the percentage
    */
   public void setInvestPercent(double newValue)
   {
      investPercent = newValue;
   }
}

/**
 * This component draws a graph of the investment result.
 */
class RetireComponent extends JComponent
{
   private static final int PANEL_WIDTH = 400;
   private static final int PANEL_HEIGHT = 200;
   private static final Dimension PREFERRED_SIZE = new Dimension(800, 600);
   private RetireInfo info = null;
   private Color colorPre;
   private Color colorGain;
   private Color colorLoss;

   public RetireComponent()
   {
      setSize(PANEL_WIDTH, PANEL_HEIGHT);
   }

   /**
    * Sets the retirement information to be plotted.
    * @param newInfo the new retirement info.
    */
   public void setInfo(RetireInfo newInfo)
   {
      info = newInfo;
      repaint();
   }

   public void paintComponent(Graphics g)
   {
      var g2 = (Graphics2D) g;
      if (info == null) return;

      double minValue = 0;
      double maxValue = 0;
      int i;
      for (i = info.getCurrentAge(); i <= info.getDeathAge(); i++)
      {
         double v = info.getBalance(i);
         if (minValue > v) minValue = v;
         if (maxValue < v) maxValue = v;
      }
      if (maxValue == minValue) return;

      int barWidth = getWidth() / (info.getDeathAge() - info.getCurrentAge() + 1);
      double scale = getHeight() / (maxValue - minValue);

      for (i = info.getCurrentAge(); i <= info.getDeathAge(); i++)
      {
         int x1 = (i - info.getCurrentAge()) * barWidth + 1;
         int y1;
         double v = info.getBalance(i);
         int height;
         int yOrigin = (int) (maxValue * scale);

         if (v >= 0)
         {
            y1 = (int) ((maxValue - v) * scale);
            height = yOrigin - y1;
         }
         else
         {
            y1 = yOrigin;
            height = (int) (-v * scale);
         }

         if (i < info.getRetireAge()) g2.setPaint(colorPre);
         else if (v >= 0) g2.setPaint(colorGain);
         else g2.setPaint(colorLoss);
         var bar = new Rectangle2D.Double(x1, y1, barWidth - 2, height);
         g2.fill(bar);
         g2.setPaint(Color.black);
         g2.draw(bar);
      }
   }

   /**
    * Sets the color to be used before retirement.
    * @param color the desired color
    */
   public void setColorPre(Color color)
   {
      colorPre = color;
      repaint();
   }

   /**
    * Sets the color to be used after retirement while the account balance is positive.
    * @param color the desired color
    */
   public void setColorGain(Color color)
   {
      colorGain = color;
      repaint();
   }

   /**
    * Sets the color to be used after retirement when the account balance is negative.
    * @param color the desired color
    */
   public void setColorLoss(Color color)
   {
      colorLoss = color;
      repaint();
   }

   public Dimension getPreferredSize() { return PREFERRED_SIZE; }
}
```

---

### Listing 7.6 — `retire/RetireResources.java`

```java
package retire;

import java.awt.*;

/**
 * These are the English non-string resources for the retirement calculator.
 * @version 1.21 2001-08-27
 * @author Cay Horstmann
 */
public class RetireResources extends java.util.ListResourceBundle
{
   private static final Object[][] contents = {
   // BEGIN LOCALIZE
      { "colorPre", Color.blue }, { "colorGain", Color.white }, { "colorLoss", Color.red }
   // END LOCALIZE
   };

   public Object[][] getContents()
   {
      return contents;
   }
}
```

### Listing 7.7 — `retire/RetireResources_de.java`

```java
package retire;

import java.awt.*;

/**
 * These are the German non-string resources for the retirement calculator.
 * @version 1.21 2001-08-27
 * @author Cay Horstmann
 */
public class RetireResources_de extends java.util.ListResourceBundle
{
   private static final Object[][] contents = {
   // BEGIN LOCALIZE
      { "colorPre", Color.yellow }, { "colorGain", Color.black }, { "colorLoss", Color.red }
   // END LOCALIZE
   };

   public Object[][] getContents()
   {
      return contents;
   }
}
```

### Listing 7.8 — `retire/RetireResources_zh.java`

```java
package retire;

import java.awt.*;

/**
 * These are the Chinese non-string resources for the retirement calculator.
 * @version 1.21 2001-08-27
 * @author Cay Horstmann
 */
public class RetireResources_zh extends java.util.ListResourceBundle
{
   private static final Object[][] contents = {
   // BEGIN LOCALIZE
      { "colorPre", Color.red }, { "colorGain", Color.blue }, { "colorLoss", Color.yellow }
   // END LOCALIZE
   };

   public Object[][] getContents()
   {
      return contents;
   }
}
```

> Ba bundle class trên chỉ khác nhau ở **màu** — đó chính là ý "dùng màu khác nhau cho đồ thị cột tùy ngôn ngữ" mà sách nêu ở đầu mục.

---

### Listing 7.9 — `retire/RetireStrings.properties`

```properties
language=Language
computeButton=Compute
savings=Prior Savings
contrib=Annual Contribution
income=Retirement Income
currentAge=Current Age
retireAge=Retirement Age
deathAge=Life Expectancy
inflationPercent=Inflation
investPercent=Investment Return
retire=Age: {0,number} Balance: {1,number,currency}
```

### Listing 7.10 — `retire/RetireStrings_de.properties`

```properties
language=Sprache
computeButton=Rechnen
savings=Vorherige Ersparnisse
contrib=Jährliche Einzahlung
income=Einkommen nach Ruhestand
currentAge=Jetziges Alter
retireAge=Ruhestandsalter
deathAge=Lebenserwartung
inflationPercent=Inflation
investPercent=Investitionsgewinn
retire=Alter: {0,number} Guthaben: {1,number,currency}
```

### Listing 7.11 — `retire/RetireStrings_zh.properties`

> **Lưu ý về bản trích:** trong file text nguồn, mọi **giá trị tiếng Trung của Listing 7.11 đã bị mất** khi trích xuất PDF — chỉ còn lại các key rỗng cùng hai mảnh format string. Phần khôi phục được nguyên văn chỉ gồm:

```properties
language=
computeButton=
savings=
contrib=
income=
currentAge=
retireAge=
deathAge=
inflationPercent=
investPercent=
retire=
   : {0,number}
   : {1,number,currency}
```

Cấu trúc key **giống hệt** Listing 7.9 và 7.10; chỉ phần value tiếng Trung là không đọc được từ bản trích.

---

## Kết chương

> *"You have seen how to use the internationalization features of the Java language. You can now use resource bundles to provide translations into multiple languages, and use formatters and collators for locale-specific text processing. In the next chapter, we will delve into scripting, compiling, and annotation processing."*

**Dịch:** Bạn đã thấy cách dùng các tính năng internationalization của ngôn ngữ Java. Giờ bạn dùng được **resource bundle** để cung cấp bản dịch sang nhiều ngôn ngữ, và dùng **formatter cùng collator** cho việc xử lý text đặc thù locale. Chương sau sẽ đi sâu vào **scripting, compiling, và annotation processing**.

---

## Chương kế tiếp

→ [[01 - Scripting for the Java Platform]] — Chapter 8: Scripting, Compiling, and Annotation Processing.
