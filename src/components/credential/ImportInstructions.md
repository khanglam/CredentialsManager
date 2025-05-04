# How to Import Your Credentials from Excel

## Step 1: Open the AccountsTemplate CSV files
I've created multiple CSV files that contain structured versions of your accounts. You can open these with Excel or any spreadsheet program.

## Step 2: Complete the spreadsheets
- Review all entries and fill in any missing information
- Add any additional accounts that weren't included in the templates
- Make sure each account has at least a Service name and Username or Password
- Use the Notes column for additional information like PINs, security questions, etc.

## Step 3: Save as CSV
When you're done editing, save the file as a CSV file.

## Step 4: Import to Credentials Manager
There are two ways to import your credentials:

### Option 1: Use the CSV Import feature (Recommended)
1. In the Credentials Manager, click the "Import" button
2. Select the "CSV Format" tab
3. Either:
   - Upload your CSV file directly using the file upload button
   - Copy and paste the contents of your CSV file into the text area
4. Click "Import Credentials"

### Option 2: Use the Text Import feature
If you prefer the traditional text format, you can format your data like this for each credential:

```
ServiceName
Username: your_username
Password: your_password
Category: category_name
```

## CSV Format Specification

The CSV files should have the following columns:

1. **Service** - The name of the service or website (required)
2. **Username** - The username or email address used to log in
3. **Password** - The password for the account
4. **Category** - The category of the account (e.g., Personal, Financial, Gaming)
5. **Notes** - Any additional information about the account

Example:
```
Service,Username,Password,Category,Notes
Gmail,user@gmail.com,password123,Personal,"My main email account"
Netflix,netflix_user,netflix_pass,Entertainment,"Shared with family"
```

## Tips for Successful Imports

- Make sure your CSV file has a header row with column names
- If your notes contain commas, enclose them in double quotes
- Check that all required fields (Service and either Username or Password) are filled in
- For accounts with multiple usernames or passwords, create separate entries
- Use the Notes field for additional information like security questions, PINs, etc.
Notes: Additional information here
```

Separate each credential with a blank line.

## Security Note
After importing your credentials, consider deleting the CSV file to protect your sensitive information.

## Example Format for Manual Import

```
Google
Username: khangtlam@gmail.com
Password: your_password_here
Category: Personal
Notes: This is my main Google account

Facebook
Username: khanglamla@gmail.com
Password: your_password_here
Category: Social
Notes: Created in 2010
```

This format ensures the parser correctly identifies all your credential information.
