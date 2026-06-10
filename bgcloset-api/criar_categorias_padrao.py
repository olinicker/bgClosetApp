from database import SessionLocal
import models

def criar_categorias_padrao():
    db = SessionLocal()
    
    categoria_entrada = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.nome == "Entrada"
    ).first()
    
    if not categoria_entrada:
        categoria_entrada = models.CategoriaFinanceira(nome="Entrada", tipo="entrada")
        db.add(categoria_entrada)
        print("Categoria 'Entrada' criada com sucesso!")
    else:
        print("Categoria 'Entrada' já existe.")

    categoria_saida = db.query(models.CategoriaFinanceira).filter(
        models.CategoriaFinanceira.nome == "Saída"
    ).first()
    
    if not categoria_saida:
        categoria_saida = models.CategoriaFinanceira(nome="Saída", tipo="saída")
        db.add(categoria_saida)
        print("Categoria 'Saída' criada com sucesso!")
    else:
        print("Categoria 'Saída' já existe.")

    db.commit()

    # Sementes de categorias de produtos
    categorias_prod = ["Vestuário", "Calçados", "Acessórios", "Moda Íntima"]
    for nome in categorias_prod:
        cat_existente = db.query(models.CategoriaProduto).filter(
            models.CategoriaProduto.nome == nome
        ).first()
        if not cat_existente:
            cat = models.CategoriaProduto(nome=nome)
            db.add(cat)
            print(f"Categoria de produto '{nome}' criada com sucesso!")
        else:
            print(f"Categoria de produto '{nome}' já existe.")

    db.commit()
    db.close()
    print("Processo concluído.")

if __name__ == "__main__":
    criar_categorias_padrao()