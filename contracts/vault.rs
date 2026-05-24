use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("HYMteAnf2z3BmBMEQDDiukeq5pL2T73yimf35JjjuWWJ");

#[program]
pub mod crypto_agile_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let ix = system_instruction::transfer(
            &ctx.accounts.owner.key(),
            &ctx.accounts.vault.key(),
            amount,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn transfer_from_vault(
        ctx: Context<TransferFromVault>,
        amount: u64,
        verification_results: Vec<String>,
    ) -> Result<()> {
        require!(
            !verification_results.is_empty(),
            VaultError::NoVerificationProvided
        );

        for result in verification_results.iter() {
            require!(result == "valid", VaultError::InvalidVerification);
        }

        let vault = &mut ctx.accounts.vault;

        require!(
            vault.owner == ctx.accounts.owner.key(),
            VaultError::Unauthorized
        );

        require!(
            **vault.to_account_info().lamports.borrow() >= amount,
            VaultError::InsufficientFunds
        );

        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx
            .accounts
            .receiver
            .to_account_info()
            .try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferFromVault<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner
    )]
    pub vault: Account<'info, Vault>,

    pub owner: Signer<'info>,

    /// CHECK: Receiver can be any wallet address
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum VaultError {
    #[msg("No verification results provided")]
    NoVerificationProvided,

    #[msg("One or more algorithm signatures are invalid")]
    InvalidVerification,

    #[msg("Only the vault owner can transfer funds")]
    Unauthorized,

    #[msg("Vault does not have enough SOL")]
    InsufficientFunds,
}
